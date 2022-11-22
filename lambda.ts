export const ZERO  = p => x =>       x
export const ONE   = p => x =>     p(x)
export const TWO   = p => x =>   p(p(x))
export const THREE = p => x => p(p(p(x)))

export const FIVE = p => x => p(p(p(p(p(x)))))
export const FIFTEEN = p => x => p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(x)))))))))))))))
export const HUNDRED = p => x => p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(x))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

export const toInteger = proc => proc(n => n + 1)(0)

export const TRUE  = x => y => x
export const FALSE = x => y => y

export const toBoolean = proc => proc(true)(false)

// export const IF = b => x => y => b(x)(y)
export const IF = b => b

export const IS_ZERO = n => n(x => FALSE)(TRUE)

export const PAIR = x => y => f => f(x)(y)
export const LEFT = p => p(x => y => x)
export const RIGHT = p => p(x => y => y)
