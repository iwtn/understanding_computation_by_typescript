export const zero  = p => x =>       x
export const one   = p => x =>     p(x)
export const two   = p => x =>   p(p(x))
export const three = p => x => p(p(p(x)))

export const five = p => x => p(p(p(p(p(x)))))
export const fifteen = p => x => p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(x)))))))))))))))
export const hundred = p => x => p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(x))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

export const toInteger = proc => proc(n => n + 1)(0)

export const TRUE  = x => y => x
export const FALSE = x => y => y

export const toBoolean = proc => proc(true)(false)

// export const IF = b => x => y => b(x)(y)
export const IF = b => b

export const IS_ZERO = n => n(x => FALSE)(TRUE)
