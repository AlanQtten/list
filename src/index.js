import fs from "node:fs"

const sorter = (a, b) => {
  const a_is_en = /[a-zA-Z]/.test(a[0])
  const b_is_en = /[a-zA-Z]/.test(b[0])

  if(!a_is_en && b_is_en) {
    return -1
  }
  if(!b_is_en && a_is_en) {
    return 1
  }

  return a.localeCompare(b)
}

const isUnique = (list) => {
  return list.length === new Set(list).size
}

const asListStr = (pre, list) => {
  if(!list?.length) {
    return ''
  }

  if(!isUnique(list)) {
    // throw new Error(`${pre} has duplicates`)
    const countObj = list.reduce((acc, item) => {
      acc[item] = (acc[item] ?? 0) + 1
      return acc
    }, {})

    Object.keys(countObj).forEach(key => {
      if(countObj[key] > 1) {
        throw new Error(key)
      }
    })
  }

  return `## ${pre}(${list.length})\n` 
    + list
      .sort(sorter)
      .map(item => `- ${item}`)
      .join("\n");
}

const joinList = (key, strList) => {
  return `# ${key.toUpperCase()}\n\n` + strList
    .filter(Boolean)
    .join("\n\n")
}

const createMD = (key) => {
  import(`./constants/${key}.js`)
    .then(({ default: list, TODO_LIST }) => {
      
      const todoMD = asListStr('todo', TODO_LIST)

      const listMD = asListStr('list', list)

      fs.writeFileSync(`md/${key.toUpperCase()}.md`, joinList(key, [todoMD, listMD]))
    })
}

createMD('movie')
createMD('tv-series')
createMD('book')