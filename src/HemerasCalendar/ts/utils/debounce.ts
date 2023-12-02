export default function debounce<T extends Function>(func: T, wait = 20) {
  let h: number | any = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => func(...args), wait);
  };
  return <T>(<any>callable);
}
