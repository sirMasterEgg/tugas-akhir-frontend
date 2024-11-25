export function getInitialProfileImageSrc(name: string) {
  if (name.split(" ").length === 1) {
    return name[0];
  } else {
    return name.split(" ")[0][0] + name.split(" ")[1][0];
  }
}
