/*global describe,it,expect,beforeEach,jasmine,require*/

(function() {
    'use strict';

    describe('Ex Machina', function() {
        var machine;

        function fillMachine(config) {
            machine.state('cart', function(payload) {
                payload.price = config.price;

                return payload;
            });

            machine.state('purchase', function(payload) {
                payload.payment = config.payment;

                return payload;
            });

            machine.state('delivery', function(payload) {
                payload.delivery = config.delivery;

                return payload;
            });

            machine.state('feedback', function(payload) {
                payload.feedback = config.feedback;

                return payload;
            });

            machine.state('cancel', function(payload) {
                payload.canceled = config.canceled;

                return payload;
            });
        }

        beforeEach(function() {
            machine = exMachina({
                cart: {
                    purchase: function(payload) {
                        return payload.clickOnPurchase;
                    },
                    cancel: function(payload) {
                        return payload.clickOnCancel;
                    },
                },
                purchase: {
                    delivery: function(payload) {
                        return payload.payment === 'validated';
                    },
                    cancel: function(payload) {
                        return payload.clickOnCancel;
                    },
                },
                delivery: {
                    feedback: function(payload) {
                        return payload.delivery !== 'waiting';
                    },
                    cancel: function(payload) {
                        return payload.clickOnCancel;
                    },
                },
            });
        });

        it('should run a machine and return a promise resolved with a payload when a final state is reached #1', function(done) {
            fillMachine({
                price: 120.9,
                payment: 'validated',
                delivery: 'away',
                feedback: 'Delivered when nobody was here! Such a shame!',
                canceled: true,
            });

            expect(Object.keys(machine.states())).toEqual([
                'cart',
                'purchase',
                'delivery',
                'feedback',
                'cancel',
            ]);

            var callback = jasmine.createSpy('callback');

            machine('cart', { clickOnPurchase: true })
                .then(callback)
                .finally(function() {
                    expect(callback).toHaveBeenCalledWith({
                        clickOnPurchase: true,
                        price: 120.9,
                        payment: 'validated',
                        delivery: 'away',
                        feedback: 'Delivered when nobody was here! Such a shame!',
                    });

                    expect(machine.currentStateName()).toBe('feedback');

                    done();
                });
        });

        it('should run a machine and return a promise resolved with a payload when a final state is reached #2', function(done) {
            fillMachine({
                price: 120.9,
                payment: 'validated',
                delivery: 'waiting',
                feedback: 'Delivered when nobody was here! Such a shame!',
                canceled: true,
            });

            expect(Object.keys(machine.states())).toEqual([
                'cart',
                'purchase',
                'delivery',
                'feedback',
                'cancel',
            ]);

            var callback = jasmine.createSpy('callback');

            machine('cart', { clickOnPurchase: true })
                .then(callback)
                .finally(function() {
                    expect(callback).toHaveBeenCalledWith({
                        clickOnPurchase: true,
                        price: 120.9,
                        payment: 'validated',
                        delivery: 'waiting',
                    });

                    expect(machine.currentStateName()).toBe('delivery');

                    done();
                });
        });

        it('should run a machine and return a promise resolved with a payload when a final state is reached #3', function(done) {
            fillMachine({
                price: 120.9,
                payment: 'validated',
                delivery: 'waiting',
                feedback: 'Delivered when nobody was here! Such a shame!',
                canceled: true,
            });

            expect(Object.keys(machine.states())).toEqual([
                'cart',
                'purchase',
                'delivery',
                'feedback',
                'cancel',
            ]);

            var callback = jasmine.createSpy('callback');

            machine('cart', { clickOnCancel: true })
                .then(callback)
                .finally(function() {
                    expect(callback).toHaveBeenCalledWith({
                        clickOnCancel: true,
                        price: 120.9,
                        canceled: true,
                    });

                    expect(machine.currentStateName()).toBe('cancel');

                    done();
                });
        });

        it('should run a machine and return the list of states executed', function(done) {
            fillMachine({
                price: 120.9,
                payment: 'validated',
                delivery: 'waiting',
                feedback: 'Delivered when nobody was here! Such a shame!',
                canceled: true,
            });

            machine('cart', { clickOnPurchase: true })
                .finally(function() {
                    expect(machine.history()).toEqual([
                        'cart',
                        'purchase',
                        'delivery',
                    ]);

                    done();
                });
        });

        it('should run a machine and emit events before and after state completion', function(done) {
            fillMachine({
                price: 120.9,
                payment: 'validated',
                delivery: 'waiting',
                feedback: 'Delivered when nobody was here! Such a shame!',
                canceled: true,
            });

            var preArgs = [];
            var postArgs = [];

            var listener = {
                preListener: function() {
                    var args = Array.prototype.slice.call(arguments);
                    // Clone the arguments as they are currently passed to
                    // states handlers by reference meaning handlers might
                    // update the state of previous handlers
                    preArgs.push(Object.assign(args[0]));
                },
                postListener: function() {
                    var args = Array.prototype.slice.call(arguments);
                    // Clone the arguments as they are currently passed to
                    // states handlers by reference meaning handlers might
                    // update the state of previous handlers
                    postArgs.push(Object.assign(args[0]));
                }
            }

            machine.on(machine.PRE_STATE_EVENT, listener.preListener);
            machine.on(machine.POST_STATE_EVENT, listener.postListener);

            machine('cart', { clickOnPurchase: true })
                .catch(done)
                .finally(function() {
                    expect(preArgs).toEqual([
                        {
                            stateName: 'cart',
                            payload: {
                                clickOnPurchase: true,
                            }
                        },
                        {
                            stateName: 'purchase',
                            payload: {
                                clickOnPurchase: true,
                                price: 120.9,
                            }
                        },
                        {
                            stateName: 'delivery',
                            payload: {
                                clickOnPurchase: true,
                                price: 120.9,
                                payment: 'validated',
                            }
                        },
                    ]);

                    expect(postArgs).toEqual([
                        {
                            stateName: 'cart',
                            payload: {
                                clickOnPurchase: true,
                                price: 120.9,
                            }
                        },
                        {
                            stateName: 'purchase',
                            payload: {
                                clickOnPurchase: true,
                                price: 120.9,
                                payment: 'validated',
                            }
                        },
                        {
                            stateName: 'delivery',
                            payload: {
                                clickOnPurchase: true,
                                price: 120.9,
                                payment: 'validated',
                                delivery: 'waiting',
                            }
                        },
                    ]);

                    done();
                });
        });
    });
})();
