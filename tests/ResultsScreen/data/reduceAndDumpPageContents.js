function downloadBlob(blob, filename) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

const mainInventory = document.querySelector('.main-inventory')
const kindredPg = document.getElementById('kindred_pg')

if (!mainInventory) throw new Error('No main-inventory element found.')
if (!kindredPg) throw new Error('No kindred_pg element found.')

function findCommonAncestor(el1, el2) {
    const parents1 = []
    let p = el1
    while (p) {
        parents1.push(p)
        p = p.parentElement
    }

    p = el2
    while (p) {
        if (parents1.includes(p)) return p
        p = p.parentElement
    }

    return null
}

const commonAncestor = findCommonAncestor(mainInventory, kindredPg)

if (!commonAncestor) throw new Error('No common ancestor found.')

const styleTags = document.querySelectorAll('style')
styleTags.forEach(tag => tag.remove())

const htmlContent = document.documentElement.outerHTML

const jsonData = {
    content: htmlContent
}

const jsonString = JSON.stringify(jsonData, null, 2)
const blob = new Blob([jsonString], {type: 'application/json'})

downloadBlob(blob, 'pageWithAmulets.json')

console.log('Webpage content saved as JSON in pageWithAmulets.json')
