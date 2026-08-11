export const parseLinkFromEgg = (id: string) => {
  return `${useRuntimeConfig().public.url}/egg/${id}`;
};
