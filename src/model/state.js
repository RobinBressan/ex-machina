import assign from 'object-assign';
import Q from 'q';

export default (callback) => {
    return (payload) => {
        return Q.fcall(callback.bind(callback, payload));
    };
};
