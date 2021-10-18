const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 用来描述标签的
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的  捕获的是结束标签的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的  分组1 拿到的是属性名  , 分组3 ，4， 5 拿到的是key对应的值

const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的    />    >   
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配双花括号中间单的内容


function parseHtml(html) {
  let root = null
  const stack = []
  const advance = len => {
    html = html.slice(len)
  }

  const parseStartTag = () => {
    let attrMatched = null
    const attrs = []
    const startTagOpenMatch = html.match(startTagOpen)
    if (startTagOpenMatch === null)
      return null
    advance(startTagOpenMatch[0].length)
    while (attrMatched = html.match(attribute)) {
      attrs.push({
        name: attrMatched[1],
        value: attrMatched[3] || attrMatched[4] || attrMatched[5] || true
      })
      advance(attrMatched[0].length)
    }
    const endMatched = html.match(startTagClose)
    if (!endMatched) return null
    advance(endMatched[0].length)
    return {
      tagName: startTagOpenMatch[1],
      attrs
    }
  }

  const parseEndTag = () => {
    const matched = html.match(endTag)
    if (matched)
      advance(matched[0].length)
    return matched
  }

  const parseText = (len) => {
    const text = html.slice(0, len).trim()
    advance(len)
    return text.length !== 0 ? text : null
  }

  const createNodeElement = (tagName, attrs) => {
    return {
      tag: tagName,
      attrs,
      parent: null,
      children: [],
      type: 1
    }
  }

  const createTextElement = text => {
    return {
      text,
      parent: null,
      type: 3
    }
  }

  const start = (tagName, attrs) => {
    const element = createNodeElement(tagName, attrs)
    if (root === null) {
      root = element
    }
    const parent = stack[stack.length - 1]
    if (parent) {
      element.parent = parent
      parent.children.push(element)
    }
    stack.push(element)
    return element
  }

  const end = () => {
    stack.pop()
  }

  const content = text => {
    const element = createTextElement(text)
    const parent = stack[stack.length - 1]
    if (parent) {
      parent.children.push(element)
      element.parent = parent
    }
  }


  while (html.length !== 0) {
    const index = html.indexOf('<')
    if (index === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch)
        start(startTagMatch.tagName, startTagMatch.attrs)
      const endTagMatched = parseEndTag()
      if (endTagMatched)
        end()
    } else {
      const text = parseText(index)
      text !== null && content(text)
    }
  }
  return root
}

function genProps(attrs) {
  const  result = {}
  for (let i = 0; i < attrs.length; i++) {
    if (attrs[i].name === 'style') {
      attrs[i].value = attrs[i].value.split(';').reduce((previousValue, currentValue) => {
        const [k, v] = currentValue.split(':')
        previousValue[k] = v
        return previousValue
      }, ({}))
    }
    result[attrs[i].name] = attrs[i].value
  }
  
  return JSON.stringify(result)

}

function genChildren(children) {
  return children.map(child => gen(child)).join(', ')
}

function genTagCode(ast) {
  const attrs = ast.attrs.length !== 0 ? genProps(ast.attrs) : undefined
  const children = ast.children.length !== 0 ?', ' + genChildren(ast.children) : ''
  return  `_c("${ast.tag}", ${attrs}${children})`
}

function genTextCode(ast) {
  const text = ast.text
  let matched = null
  let index = 0
  let result = ''
  let str = ''
  const tokens = []
  while (matched = defaultTagRE.exec(text)) {
    const name = matched[1]
    if (matched.index > index) {
     str = text.slice(index, matched.index)
      // result += `"${str}"`
      tokens.push(`"${str}"`)
    }
    // result +=
    tokens.push(`_s(${name})`)
    index = defaultTagRE.lastIndex
  }
  if (index < text.length)
    tokens.push(`"${text.slice(index)}"`)
    // result +=
  return `_v(${tokens.join('+')})`
}

function gen(ast) {
  if (ast.type === 1) {
    return genTagCode(ast)
  }
  if (ast.type === 3) {
    return  genTextCode(ast)
  }

}


export function compileToFunction(html) {
  const ast = parseHtml(html)
  // console.log(ast)
  const code = gen(ast)
  // console.log(code)
  return new Function(`with(this){return ${code}}`)
}






