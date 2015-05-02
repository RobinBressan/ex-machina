import assign from 'object-assign';
import stateModel from 'model/state';
import events from 'events';
import Q from 'q';

var PRE_STATE_EVENT = 'state:pre';
var POST_STATE_EVENT = 'state:post';

export default (config) => {

    var _states = {};
    var _history = [];
    var currentStateName;

    var emitter = new events.EventEmitter();

    var machine = assign((firstStateName, initialPayload) => {
        currentStateName = firstStateName;

        var run = (previousPayload) => {
            var currentState = _states[currentStateName];

            if (!currentState) {
                throw new Error('The state ' + currentStateName + ' does not exists');
            }

            machine.emit(PRE_STATE_EVENT, {
                stateName: currentStateName,
                payload: previousPayload,
            });

            return currentState(previousPayload).then((nextPayload) => {
                _history.push(currentStateName);

                machine.emit(POST_STATE_EVENT, {
                    stateName: currentStateName,
                    payload: nextPayload,
                });

                var targets = [];
                var transitions = config[currentStateName] || {};

                for (var targetStateName in transitions) {
                    if (config[currentStateName][targetStateName](nextPayload)) {
                        targets.push(targetStateName);
                    }
                }

                if (targets.length > 1) {
                    throw new Error('You can not activate several state at once')
                }

                if (targets.length > 0) {
                    currentStateName = targets[0];
                    return Q.fcall(run.bind(run, nextPayload));
                }

                return nextPayload;
            });
        }

        return Q.fcall(run.bind(run, initialPayload));
    }, events.EventEmitter.prototype, {
        state(name, callback) {
            _states[name] = stateModel(callback);
        },

        currentStateName() {
            return currentStateName
        },

        states() {
            return assign({}, _states);
        },

        history() {
            return _history;
        },

        POST_STATE_EVENT: POST_STATE_EVENT,

        PRE_STATE_EVENT: PRE_STATE_EVENT,
    });

    return machine;
};
