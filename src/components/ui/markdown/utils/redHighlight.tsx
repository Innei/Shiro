export function redHighlight(id: string) {
  const fnRefElement = document.getElementById(id)
  if (fnRefElement) {
    fnRefElement.style.color = '#ef4444'
    setTimeout(() => {
      fnRefElement.style.color = ''
    }, 5000)
  } else {
    console.log(`Element with id fnref:${id} not found.`)
  }
}
