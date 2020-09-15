type TEventHandler = (arg?: any) => void;

interface IEventsHash {
    [key: string]: TEventHandler[];
}

export class EventHandler {

    private events: IEventsHash = {};

    attach(eventName: string, callback: TEventHandler) {
        this.events[eventName] = [ ...(this.events[eventName] || []), callback ];
    }

    detach(eventName: string, callback: TEventHandler) {
        this.events[eventName] = (this.events[eventName] || []).filter(eh => eh !== callback);
    }

    trigger(eventName: string, ...rest: any[]) {
        (this.events[eventName] || []).forEach(eh => eh.apply(this, rest));
    }
}