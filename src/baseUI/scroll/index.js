import { forwardRef, useState, useEffect } from 'react'
import propTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from'styled-components'

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
  // 首先声明如下 hooks 变量:

  // 每次渲染，函数都会重新执行。我们知道，每当函数执行完毕，所有的内存都会被释放掉。因此想让函数式组件拥有内部状态，并不是一件理所当然的事情。
  // 当然，也不是完全没有办法，useState就是帮助我们做这个事情。
  // useState利用闭包，在函数内部创建一个当前函数组件的状态。并提供一个修改该状态的方法。
  const [bScrool, setBScroll] = useState()

  const scrollContainerRef = useRef()

  const {
    direction,
    click,
    refresh,
    bounceTop,
    bounceBottom
  } = props

  const {
    onScroll,
    pullUp,
    pullDown,
  } = props

  // 创建 better-scroll
  useEffect (() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll (scroll)
    return () => {
      setBScroll (null)
    }
  }, [])

  // 每次重新渲染都要刷新实例，防止无法滑动:
  useEffect (() => {
    if (refresh && bScrool) {
      bScrool.refresh()
    }
  })

  // 给实例绑定 scroll 事件
  useEffect (() => {
    if (!bScrool || !onScroll) return
    bScrool.on('scroll', scroll => {
      onScroll(scroll)
    })
    return () => {
      bScrool.off('scroll')
    }
  }, [onScroll, bScrool])

  // 上拉到底的判断，调用上拉刷新的函数
  useEffect (() => {
    if (!bScrool || !pullUp) return
    bScrool.on('scrollEnd', () => {
      // 判断是否滑动到了底部
      if (bScrool.y <= bScrool.maxScrollY + 100) {
        pullUp()
      }
    })
    return () => {
      bScroll.off ('scrollEnd')
    }
  }, [pullUp, bScrool])

  // 下拉的判断，调用下拉刷新的函数
  useEffect (() => {
    if (!bScrool || !pullDown) return
    bScrool.on('touchEnd', pos => {
      // 判断用户的下拉动作
      if (pos > 50) {
        pullDown()
      }
    })
    return () => {
      bScrool.off('touchEnd')
    }
  }, [pullUp, bScrool])

  useEffect (() => {
    if (refresh && bScrool) {
      bScrool.refresh()
    }
  })

  // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
  useImperativeHandle(ref, () => ({
    // 给外界暴露 refresh 方法
    refresh () {
      if (bScrool) {
        bScrool.refresh()
        bScrool.srollTo(0, 0)
      }
    },
    // 给外界暴露 getBScroll 方法，提供 bs 实例
    getBScroll () {
      if (bScrool) {
        return bScrool
      }
    }
  }))

  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
    </ScrollContainer>
  );
})


Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUp: null,
  pullDown: null,
  pullUpLoading: false,
  pullDownLoading: false,
  bounceTop: true,
  bounceBottom: true
}

Scroll.propTypes = {
  direction: propTypes.oneOf(['vertical', 'horizental']),
  click: true, // 是否支持点击
  refresh: propTypes.bool, // 是否刷新
  onScroll: propTypes.func, // 滑动触发的回调函数
  pullUp: propTypes.func, // 上拉加载逻辑
  pullDown: propTypes.func, // 下拉加载逻辑
  pullUpLoading: propTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: propTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: propTypes.bool, // 是否支持向上吸顶
  bounceBottom: propTypes.bool // 是否支持向下吸底
}
