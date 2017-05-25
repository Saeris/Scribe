export const promiseMapAll = async promiseMap => {
  try {
    const promises = await Promise.all(Object.values(promiseMap))
    let objMapped = {}
    Object.keys(promiseMap).forEach((key, i) => {
      objMapped[key] = promises[i]
    })
    return objMapped
  } catch (err) {
    return { err }
  }
}
