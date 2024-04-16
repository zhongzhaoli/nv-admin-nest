// 排除所有空值
export const excludeNullValue = <T>(query: T): Partial<T> => {
  const newValue: Partial<T> = {};
  Object.keys(query).forEach((item) => {
    if (query[item]) newValue[item] = query[item];
  });
  return newValue;
};
