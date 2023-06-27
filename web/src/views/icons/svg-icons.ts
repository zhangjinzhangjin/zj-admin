const svgs = import.meta.glob('../../assets/svgs/*.svg')
const modules: any = [];
Object.keys(svgs).forEach((key: string) => {
  const splitBuffer = key.split("/");
  const svgName = splitBuffer[splitBuffer.length - 1];
  const name = svgName.split(".")[0]
  modules.push(name)
})
export default modules