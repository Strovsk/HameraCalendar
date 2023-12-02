export default interface IMediator {
  states: {
    isDatesView: boolean;
  };
  notify<T, K>(
    sender: T,
    component: keyof Components,
    classmethod: string,
    payload?: K
  ): void;
}
