export const findAndReplace = (array, find, replace, key = 'id') => {
  const arr = [...array];
  let i;
  for (i = 0; i < arr.length && arr[i][key] !== find[key]; i++) {};
  if (i < arr.length) arr[i] = replace;
  else arr.push(replace);
  return arr;
};
