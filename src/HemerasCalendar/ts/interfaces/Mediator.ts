export default interface IMediator {
    notify<T, K>(sender: T, component: keyof Components, classmethod: string, payload?: K): void;
}
