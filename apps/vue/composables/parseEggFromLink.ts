export const parseEggFromLink = (link: string) => {
  const arr = link.split(`${useRuntimeConfig().public.url}/egg/`);
  const id = arr[arr.length - 1];
  return id;
};
