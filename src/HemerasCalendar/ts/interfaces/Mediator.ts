export default interface IMediator {
    notify<T>(sender: T, component: keyof Components, classmethod: string): void;
}
