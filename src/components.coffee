#事件分发
class Event
    constructor:()->
        @subscription = {}

    $subscribe: (type, fn, cons)->
        if "undefined" is typeof @subscription.eventmap
            @subscription.eventmap = {}
        if "undefined" is typeof @subscription[type]
            @subscription[type] = []
        p = @subscription[type]
        r = false
        if p.length > 0
            f = fn.toString()
            r = !@each.call(p, (item)->
                if item and f is item.response.toString() and cons and cons is item.caller
                    return false 
            )
        if false is r
            id = Math.floor(Math.random() * 1000000000000000).toString(36)
            @subscription.eventmap[id] = type
            p.push({"id": id, "response": fn, "caller": cons})
        return id

    #订阅
    #@type 事件类型 string or array
    #@fn 事件的回调函数
    #@cons 执行回调函数的对象
    subscribe:(type, fn, cons)->
        if typeof type=='string'
            @$subscribe(type, fn, cons)
        else if Object.prototype.toString.call(type) == '[object Array]'
            @$subscribe t,fn,cons for t in type


    #触发事件
    #@type 事件类型
    #如果还有其它参数，则会传入回调函数   
    publish: (type)->
        p = @subscription[type]
        if p and p.length
            params = if arguments.length > 0 then Array.prototype.slice.call(arguments) else []
            publisher = @
            params.unshift(publisher)
            @each.call(p, (item)->
                if item
                    cons = item.caller || null
                    item.response.apply(cons, params)
            )
        return @

    #取消订阅，如果没有参数，则取消所有订阅
    #@id 订阅时生成的ID或订阅的事件类型
    #@handle 如果handle值为"type",则@id表示订阅事件类型,此时将取消所有此类型订阅
    unsubscribe: (id, handle)->
        if "string" is typeof id
            if "type" is handle
                @subscription[type] and (@subscription[type].length = 0)       
            else
                map = @subscription.eventmap
                type = map[id]
                if type
                    p = @subscription[type]
                    if p and p.length > 0
                        @each.call(p, (item, index)->
                            if item and id is item.id
                                #p.splice(index, 1)
                                p[index] = null
                                map[id] = null
                                delete map[id]
                                return false
                        )                       
        else
            @subscription = {}
        return @

    #遍历对象或数组，遍历时如果返回false,则退出循环
    each: (fn)->
        len = @length;
        params = arguments.length > 1 and Array.prototype.slice.call(arguments, 1) or []
        if "number" is typeof len
            for item, index in @
                result = fn.apply(@, [item, index].concat(params))
                if result is false
                    return false
        else
            for key, item of @
                if @hasOwnProperty(key)
                    result = fn.apply(@, [item, key].concat(params))
                    if result is false
                        return false
        return true

#组件基类
#只创建组件的私有属性以及定义了组件的初始化动作
#@id 组件渲染时指定页面容器的选择器或DOM对象
class Component extends Event
    constructor: (selector)->
        super()
        #页面渲染容器
        @contain = null
        if "string" is typeof selector
            node = document.querySelector(selector)
        else if "object" is typeof selector and selector.nodeType and 1 is selector.nodeType
            node = selector
        if node and node.getAttribute
            @contain = node
        #页面渲染完成后的动作
        @subscribe("render", @init, @)

    #基本的渲染，调用外部方法完成
    render: (fn)->
        fn?.call(@)
        @publish("render")
    #渲染完成后，调用此方法完组件的一些初始化操作，具体逻辑请在继承的组件内重写init来完成
    init: ()->

    #判断两个DOM元素的关系
    #@return{number} - 1:父子；0：自身；-1：非父子
    contains: (parent, child)->
        if parent is child
            return 0
        if parent.contains
            if parent.contains(child)
                return 1
        else
            if !!(parent.compareDocumentPosition(child) & 16)
                return 1
        return -1

    upperStyleName: (s)->
        return s and s.length and s.replace(/-([a-z])/g, (a, b)->
            return b.toUpperCase()
        ) or ''

    lowerStyleName: (s)->
        return s and s.length and s.replace(/([A-Z])/g, (a, b)->
            return '-' + b.toLowerCase()
        ) or ''

    addClass: (node, className)->
        if node and node.getAttribute
            if !@hasClass(node, className)
                node.className += " "+ className;
        return @

    removeClass: (node, className)->
        if node and node.getAttribute
            if @hasClass(node, className)
                oldClass = node.className
                reg = new RegExp("(^|\\s)#{className}(\\s|$)")
                node.className = oldClass.replace(reg, " ").replace(/(^\s+|\s+$)/g, "")
        return @

    hasClass: (node, className) ->
        if node and node.getAttribute
            reg = new RegExp("(^|\\s)#{className}(\\s|$)")
            return node.className and reg.test(node.className)
        return false

module.exports = {
    Event, Component
}
