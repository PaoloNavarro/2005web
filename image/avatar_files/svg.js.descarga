;(function(){this.SVG=function(element){if(SVG.supported)
return new SVG.Doc(element)}
SVG.ns='http://www.w3.org/2000/svg'
SVG.xlink='http://www.w3.org/1999/xlink'
SVG.did=1000
SVG.eid=function(name){return 'Svgjs'+name.charAt(0).toUpperCase()+name.slice(1)+(SVG.did++)}
SVG.create=function(name){var element=document.createElementNS(this.ns,name)
element.setAttribute('id',this.eid(name))
return element}
SVG.extend=function(){var modules,methods,key,i
modules=[].slice.call(arguments)
methods=modules.pop()
for(i=modules.length-1;i>=0;i--)
if(modules[i])
for(key in methods)
modules[i].prototype[key]=methods[key]
if(SVG.Set&&SVG.Set.inherit)
SVG.Set.inherit()}
SVG.get=function(id){var node=document.getElementById(id)
if(node)return node.instance}
SVG.supported=(function(){return!!document.createElementNS&&!!document.createElementNS(SVG.ns,'svg').createSVGRect})()
if(!SVG.supported)return false
SVG.regex={test:function(value,test){return this[test].test(value)},unit:/^(-?[\d\.]+)([a-z%]{0,2})$/,hex:/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,rgb:/rgb\((\d+),(\d+),(\d+)\)/,isHex:/^#[a-f0-9]{3,6}$/i,isRgb:/^rgb\(/,isCss:/[^:]+:[^;]+;?/,isStyle:/^font|text|leading|cursor/,isBlank:/^(\s+)?$/,isNumber:/^-?[\d\.]+$/,isPercent:/^-?[\d\.]+%$/}
SVG.defaults={matrix:'1 0 0 1 0 0',attrs:{'fill-opacity':1,'stroke-opacity':1,'stroke-width':0,'stroke-linejoin':'miter','stroke-linecap':'butt',fill:'#000000',stroke:'#000000',opacity:1,x:0,y:0,cx:0,cy:0,width:0,height:0,r:0,rx:0,ry:0,offset:0,'stop-opacity':1,'stop-color':'#000000'},trans:function(){return{x:0,y:0,scaleX:1,scaleY:1,rotation:0,skewX:0,skewY:0,matrix:this.matrix,a:1,b:0,c:0,d:1,e:0,f:0}}}
SVG.Color=function(color){var match
this.r=0
this.g=0
this.b=0
if(typeof color=='string'){if(SVG.regex.isRgb.test(color)){match=SVG.regex.rgb.exec(color.replace(/\s/g,''))
this.r=parseInt(match[1])
this.g=parseInt(match[2])
this.b=parseInt(match[3])}else if(SVG.regex.isHex.test(color)){match=SVG.regex.hex.exec(this._fullHex(color))
this.r=parseInt(match[1],16)
this.g=parseInt(match[2],16)
this.b=parseInt(match[3],16)}}else if(typeof color=='object'){this.r=color.r
this.g=color.g
this.b=color.b}}
SVG.extend(SVG.Color,{toString:function(){return this.toHex()},toHex:function(){return '#'
+this._compToHex(this.r)
+this._compToHex(this.g)
+this._compToHex(this.b)},toRgb:function(){return 'rgb('+[this.r,this.g,this.b].join()+')'},brightness:function(){return(this.r/255*0.30)
+(this.g/255*0.59)
+(this.b/255*0.11)},_fullHex:function(hex){return hex.length==4?['#',hex.substring(1,2),hex.substring(1,2),hex.substring(2,3),hex.substring(2,3),hex.substring(3,4),hex.substring(3,4)].join(''):hex},_compToHex:function(comp){var hex=comp.toString(16)
return hex.length==1?'0'+hex:hex}})
SVG.Color.test=function(color){color+=''
return SVG.regex.isHex.test(color)||SVG.regex.isRgb.test(color)}
SVG.Color.isRgb=function(color){return color&&typeof color.r=='number'}
SVG.Array=function(array,fallback){array=(array||[]).valueOf()
if(array.length==0&&fallback)
array=fallback.valueOf()
this.value=this.parse(array)}
SVG.extend(SVG.Array,{morph:function(array){this.destination=this.parse(array)
if(this.value.length!=this.destination.length){var lastValue=this.value[this.value.length-1],lastDestination=this.destination[this.destination.length-1]
while(this.value.length>this.destination.length)
this.destination.push(lastDestination)
while(this.value.length<this.destination.length)
this.value.push(lastValue)}
return this},settle:function(){var i,seen=[]
for(i=this.value.length-1;i>=0;i--)
if(seen.indexOf(this.value[i])==-1)
seen.push(this.value[i])
return this.value=seen},at:function(pos){if(!this.destination)return this
for(var i=0,il=this.value.length,array=[];i<il;i++)
array.push(this.value[i]+(this.destination[i]-this.value[i])*pos)
return new SVG.Array(array)},toString:function(){return this.value.join(' ')},valueOf:function(){return this.value},parse:function(array){array=array.valueOf()
if(Array.isArray(array))return array
return this.split(array)},split:function(string){return string.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'').split(' ')}})
SVG.PointArray=function(){this.constructor.apply(this,arguments)}
SVG.PointArray.prototype=new SVG.Array
SVG.extend(SVG.PointArray,{toString:function(){for(var i=0,il=this.value.length,array=[];i<il;i++)
array.push(this.value[i].join(','))
return array.join(' ')},at:function(pos){if(!this.destination)return this
for(var i=0,il=this.value.length,array=[];i<il;i++)
array.push([this.value[i][0]+(this.destination[i][0]-this.value[i][0])*pos,this.value[i][1]+(this.destination[i][1]-this.value[i][1])*pos])
return new SVG.PointArray(array)},parse:function(array){array=array.valueOf()
if(Array.isArray(array))return array
array=this.split(array)
for(var i=0,il=array.length,p,points=[];i<il;i++){p=array[i].split(',')
points.push([parseFloat(p[0]),parseFloat(p[1])])}
return points},move:function(x,y){var box=this.bbox()
x-=box.x
y-=box.y
for(var i=this.value.length-1;i>=0;i--)
this.value[i]=[this.value[i][0]+x,this.value[i][1]+y]
return this},size:function(width,height){var i,box=this.bbox()
for(i=this.value.length-1;i>=0;i--){this.value[i][0]=((this.value[i][0]-box.x)*width)/box.width+box.x
this.value[i][1]=((this.value[i][1]-box.y)*height)/box.height+box.x}
return this},bbox:function(){if(this.value.length==0)
return{x:0,y:0,width:0,height:0}
var i,x=this.value[0][0],y=this.value[0][1],box={x:x,y:y}
for(i=this.value.length-1;i>=0;i--){if(this.value[i][0]<box.x)
box.x=this.value[i][0]
if(this.value[i][1]<box.y)
box.y=this.value[i][1]
if(this.value[i][0]>x)
x=this.value[i][0]
if(this.value[i][1]>y)
y=this.value[i][1]}
box.width=x-box.x
box.height=y-box.y
return box}})
SVG.Number=function(value){this.value=0
this.unit=''
switch(typeof value){case 'number':this.value=isNaN(value)?0:!isFinite(value)?(value<0?-3.4e+38:+3.4e+38):value
break
case 'string':var match=value.match(SVG.regex.unit)
if(match){this.value=parseFloat(match[1])
if(match[2]=='%')
this.value/=100
this.unit=match[2]}
break
default:if(value instanceof SVG.Number){this.value=value.value
this.unit=value.unit}
break}}
SVG.extend(SVG.Number,{toString:function(){return(this.unit=='%'?~~(this.value*1e8)/1e6:this.value)+this.unit},valueOf:function(){return this.value},to:function(unit){if(typeof unit==='string')
this.unit=unit
return this},plus:function(number){this.value=this+new SVG.Number(number)
return this},minus:function(number){return this.plus(-new SVG.Number(number))},times:function(number){this.value=this*new SVG.Number(number)
return this},divide:function(number){this.value=this/new SVG.Number(number)
return this}})
SVG.ViewBox=function(element){var x,y,width,height,box=element.bbox(),view=(element.attr('viewBox')||'').match(/-?[\d\.]+/g)
this.x=box.x
this.y=box.y
this.width=element.node.offsetWidth||element.attr('width')
this.height=element.node.offsetHeight||element.attr('height')
if(view){x=parseFloat(view[0])
y=parseFloat(view[1])
width=parseFloat(view[2])
height=parseFloat(view[3])
this.zoom=((this.width/this.height)>(width/height))?this.height/height:this.width/width
this.x=x
this.y=y
this.width=width
this.height=height}
this.zoom=this.zoom||1}
SVG.extend(SVG.ViewBox,{toString:function(){return this.x+' '+this.y+' '+this.width+' '+this.height}})
SVG.BBox=function(element){var box
this.x=0
this.y=0
this.width=0
this.height=0
if(element){try{box=element.node.getBBox()}catch(e){box={x:element.node.clientLeft,y:element.node.clientTop,width:element.node.clientWidth,height:element.node.clientHeight}}
this.x=box.x+element.trans.x
this.y=box.y+element.trans.y
this.width=box.width*element.trans.scaleX
this.height=box.height*element.trans.scaleY}
this.cx=this.x+this.width/2
this.cy=this.y+this.height/2}
SVG.extend(SVG.BBox,{merge:function(box){var b=new SVG.BBox()
b.x=Math.min(this.x,box.x)
b.y=Math.min(this.y,box.y)
b.width=Math.max(this.x+this.width,box.x+box.width)-b.x
b.height=Math.max(this.y+this.height,box.y+box.height)-b.y
b.cx=b.x+b.width/2
b.cy=b.y+b.height/2
return b}})
SVG.RBox=function(element){var e,zoom,box={}
this.x=0
this.y=0
this.width=0
this.height=0
if(element){e=element.doc().parent
zoom=element.doc().viewbox().zoom
box=element.node.getBoundingClientRect()
this.x=box.left
this.y=box.top
this.x-=e.offsetLeft
this.y-=e.offsetTop
while(e=e.offsetParent){this.x-=e.offsetLeft
this.y-=e.offsetTop}
e=element
while(e=e.parent){if(e.type=='svg'&&e.viewbox){zoom*=e.viewbox().zoom
this.x-=e.x()||0
this.y-=e.y()||0}}}
this.x/=zoom
this.y/=zoom
this.width=box.width/=zoom
this.height=box.height/=zoom
this.cx=this.x+this.width/2
this.cy=this.y+this.height/2}
SVG.Element=function(node){this._stroke=SVG.defaults.attrs.stroke
this.styles={}
this.trans=SVG.defaults.trans()
if(this.node=node){this.type=node.nodeName
this.node.instance=this}}
SVG.extend(SVG.Element,{x:function(x){if(x){x=new SVG.Number(x)
x.value/=this.trans.scaleX}
return this.attr('x',x)},y:function(y){if(y){y=new SVG.Number(y)
y.value/=this.trans.scaleY}
return this.attr('y',y)},cx:function(x){return x==null?this.bbox().cx:this.x(x-this.bbox().width/2)},cy:function(y){return y==null?this.bbox().cy:this.y(y-this.bbox().height/2)},move:function(x,y){return this.x(x).y(y)},center:function(x,y){return this.cx(x).cy(y)},size:function(width,height){return this.attr({width:new SVG.Number(width),height:new SVG.Number(height)})},clone:function(){var clone,attr,type=this.type
clone=type=='rect'||type=='ellipse'?this.parent[type](0,0):type=='line'?this.parent[type](0,0,0,0):type=='image'?this.parent[type](this.src):type=='text'?this.parent[type](this.content):type=='path'?this.parent[type](this.attr('d')):type=='polyline'||type=='polygon'?this.parent[type](this.attr('points')):type=='g'?this.parent.group():this.parent[type]()
attr=this.attr()
delete attr.id
clone.attr(attr)
clone.trans=this.trans
return clone.transform({})},remove:function(){if(this.parent)
this.parent.removeElement(this)
return this},doc:function(type){return this._parent(type||SVG.Doc)},attr:function(a,v,n){if(a==null){a={}
v=this.node.attributes
for(n=v.length-1;n>=0;n--)
a[v[n].nodeName]=SVG.regex.test(v[n].nodeValue,'isNumber')?parseFloat(v[n].nodeValue):v[n].nodeValue
return a}else if(typeof a=='object'){for(v in a)this.attr(v,a[v])}else if(v===null){this.node.removeAttribute(a)}else if(v==null){if(this._isStyle(a)){return a=='text'?this.content:a=='leading'&&this.leading?this.leading():this.style(a)}else{v=this.node.getAttribute(a)
return v==null?SVG.defaults.attrs[a]:SVG.regex.test(v,'isNumber')?parseFloat(v):v}}else if(a=='style'){return this.style(v)}else{if(a=='x'&&Array.isArray(this.lines))
for(n=this.lines.length-1;n>=0;n--)
this.lines[n].attr(a,v)
if(a=='stroke-width')
this.attr('stroke',parseFloat(v)>0?this._stroke:null)
else if(a=='stroke')
this._stroke=v
if(SVG.Color.test(v)||SVG.Color.isRgb(v))
v=new SVG.Color(v)
else if(typeof v==='number')
v=new SVG.Number(v)
else if(Array.isArray(v))
v=new SVG.Array(v)
n!=null?this.node.setAttributeNS(n,a,v.toString()):this.node.setAttribute(a,v.toString())
if(this._isStyle(a)){a=='text'?this.text(v):a=='leading'&&this.leading?this.leading(v):this.style(a,v)
if(this.rebuild)
this.rebuild(a,v)}}
return this},transform:function(o,v){if(arguments.length==0){return this.trans}else if(typeof o==='string'){if(arguments.length<2)
return this.trans[o]
var transform={}
transform[o]=v
return this.transform(transform)}
var transform=[]
o=this._parseMatrix(o)
for(v in o)
if(o[v]!=null)
this.trans[v]=o[v]
this.trans.matrix=this.trans.a
+' '+this.trans.b
+' '+this.trans.c
+' '+this.trans.d
+' '+this.trans.e
+' '+this.trans.f
o=this.trans
if(o.matrix!=SVG.defaults.matrix)
transform.push('matrix('+o.matrix+')')
if(o.rotation!=0)
transform.push('rotate('+o.rotation+' '+(o.cx==null?this.bbox().cx:o.cx)+' '+(o.cy==null?this.bbox().cy:o.cy)+')')
if(o.scaleX!=1||o.scaleY!=1)
transform.push('scale('+o.scaleX+' '+o.scaleY+')')
if(o.skewX!=0)
transform.push('skewX('+o.skewX+')')
if(o.skewY!=0)
transform.push('skewY('+o.skewY+')')
if(o.x!=0||o.y!=0)
transform.push('translate('+new SVG.Number(o.x/o.scaleX)+' '+new SVG.Number(o.y/o.scaleY)+')')
if(this._offset&&this._offset.x!=0&&this._offset.y!=0)
transform.push('translate('+(-this._offset.x)+' '+(-this._offset.y)+')')
if(transform.length==0)
this.node.removeAttribute('transform')
else
this.node.setAttribute('transform',transform.join(' '))
return this},style:function(s,v){if(arguments.length==0){return this.attr('style')||''}else if(arguments.length<2){if(typeof s=='object'){for(v in s)this.style(v,s[v])}else if(SVG.regex.isCss.test(s)){s=s.split(';')
for(var i=0;i<s.length;i++){v=s[i].split(':')
if(v.length==2)
this.style(v[0].replace(/\s+/g,''),v[1].replace(/^\s+/,'').replace(/\s+$/,''))}}else{return this.styles[s]}}else if(v===null||SVG.regex.test(v,'isBlank')){delete this.styles[s]}else{this.styles[s]=v}
s=''
for(v in this.styles)
s+=v+':'+this.styles[v]+';'
if(s=='')
this.node.removeAttribute('style')
else
this.node.setAttribute('style',s)
return this},data:function(a,v,r){if(arguments.length<2){try{return JSON.parse(this.attr('data-'+a))}catch(e){return this.attr('data-'+a)}}else{this.attr('data-'+a,v===null?null:r===true||typeof v==='string'||typeof v==='number'?v:JSON.stringify(v))}
return this},bbox:function(){return new SVG.BBox(this)},rbox:function(){return new SVG.RBox(this)},inside:function(x,y){var box=this.bbox()
return x>box.x&&y>box.y&&x<box.x+box.width&&y<box.y+box.height},show:function(){return this.style('display','')},hide:function(){return this.style('display','none')},visible:function(){return this.style('display')!='none'},toString:function(){return this.attr('id')},_parent:function(parent){var element=this
while(element!=null&&!(element instanceof parent))
element=element.parent
return element},_isStyle:function(a){return typeof a=='string'?SVG.regex.test(a,'isStyle'):false},_parseMatrix:function(o){if(o.matrix){var m=o.matrix.replace(/\s/g,'').split(',')
if(m.length==6){o.a=parseFloat(m[0])
o.b=parseFloat(m[1])
o.c=parseFloat(m[2])
o.d=parseFloat(m[3])
o.e=parseFloat(m[4])
o.f=parseFloat(m[5])}}
return o}})
SVG.Parent=function(element){this.constructor.call(this,element)}
SVG.Parent.prototype=new SVG.Element
SVG.extend(SVG.Parent,{children:function(){return this._children||(this._children=[])},add:function(element,i){if(!this.has(element)){i=i==null?this.children().length:i
if(element.parent){var index=element.parent.children().indexOf(element)
element.parent.children().splice(index,1)}
this.children().splice(i,0,element)
this.node.insertBefore(element.node,this.node.childNodes[i]||null)
element.parent=this}
if(this._defs){this.node.removeChild(this._defs.node)
this.node.appendChild(this._defs.node)}
return this},put:function(element,i){this.add(element,i)
return element},has:function(element){return this.children().indexOf(element)>=0},get:function(i){return this.children()[i]},first:function(){return this.children()[0]},last:function(){return this.children()[this.children().length-1]},each:function(block,deep){var i,il,children=this.children()
for(i=0,il=children.length;i<il;i++){if(children[i]instanceof SVG.Element)
block.apply(children[i],[i,children])
if(deep&&(children[i]instanceof SVG.Container))
children[i].each(block,deep)}
return this},removeElement:function(element){var i=this.children().indexOf(element)
this.children().splice(i,1)
this.node.removeChild(element.node)
element.parent=null
return this},clear:function(){for(var i=this.children().length-1;i>=0;i--)
this.removeElement(this.children()[i])
if(this._defs)
this._defs.clear()
return this},defs:function(){return this.doc().defs()}})
SVG.Container=function(element){this.constructor.call(this,element)}
SVG.Container.prototype=new SVG.Parent
SVG.extend(SVG.Container,{viewbox:function(v){if(arguments.length==0)
return new SVG.ViewBox(this)
v=arguments.length==1?[v.x,v.y,v.width,v.height]:[].slice.call(arguments)
return this.attr('viewBox',v)}})
SVG.FX=function(element){this.target=element}
SVG.extend(SVG.FX,{animate:function(d,ease,delay){var akeys,tkeys,skeys,key,element=this.target,fx=this
if(typeof d=='object'){delay=d.delay
ease=d.ease
d=d.duration}
d=d==null?1000:d
ease=ease||'<>'
fx.to=function(pos){var i
pos=pos<0?0:pos>1?1:pos
if(akeys==null){akeys=[]
for(key in fx.attrs)
akeys.push(key)
if(element.morphArray){var box,p=new element.morphArray(fx._plot||element.points.toString())
if(fx._size)p.size(fx._size.width.to,fx._size.height.to)
box=p.bbox()
if(fx._x)p.move(fx._x.to,box.y)
else if(fx._cx)p.move(fx._cx.to-box.width/2,box.y)
box=p.bbox()
if(fx._y)p.move(box.x,fx._y.to)
else if(fx._cy)p.move(box.x,fx._cy.to-box.height/2)
delete fx._x
delete fx._y
delete fx._cx
delete fx._cy
delete fx._size
fx._plot=element.points.morph(p)}}
if(tkeys==null){tkeys=[]
for(key in fx.trans)
tkeys.push(key)}
if(skeys==null){skeys=[]
for(key in fx.styles)
skeys.push(key)}
pos=ease=='<>'?(-Math.cos(pos*Math.PI)/2)+0.5:ease=='>'?Math.sin(pos*Math.PI/2):ease=='<'?-Math.cos(pos*Math.PI/2)+1:ease=='-'?pos:typeof ease=='function'?ease(pos):pos
if(fx._x)
element.x(fx._at(fx._x,pos))
else if(fx._cx)
element.cx(fx._at(fx._cx,pos))
if(fx._y)
element.y(fx._at(fx._y,pos))
else if(fx._cy)
element.cy(fx._at(fx._cy,pos))
if(fx._size)
element.size(fx._at(fx._size.width,pos),fx._at(fx._size.height,pos))
if(fx._plot)
element.plot(fx._plot.at(pos))
if(fx._viewbox)
element.viewbox(fx._at(fx._viewbox.x,pos),fx._at(fx._viewbox.y,pos),fx._at(fx._viewbox.width,pos),fx._at(fx._viewbox.height,pos))
for(i=akeys.length-1;i>=0;i--)
element.attr(akeys[i],fx._at(fx.attrs[akeys[i]],pos))
for(i=tkeys.length-1;i>=0;i--)
element.transform(tkeys[i],fx._at(fx.trans[tkeys[i]],pos))
for(i=skeys.length-1;i>=0;i--)
element.style(skeys[i],fx._at(fx.styles[skeys[i]],pos))
if(fx._during)
fx._during.call(element,pos,function(from,to){return fx._at({from:from,to:to},pos)})}
if(typeof d==='number'){this.timeout=setTimeout(function(){var interval=1000/60,start=new Date().getTime(),finish=start+d
fx.interval=setInterval(function(){var time=new Date().getTime(),pos=time>finish?1:(time-start)/d
fx.to(pos)
if(time>finish){if(fx._plot)
element.plot(new SVG.PointArray(fx._plot.destination).settle())
clearInterval(fx.interval)
fx._after?fx._after.apply(element,[fx]):fx.stop()}},d>interval?interval:d)},delay||0)}
return this},bbox:function(){return this.target.bbox()},attr:function(a,v,n){if(typeof a=='object')
for(var key in a)
this.attr(key,a[key])
else
this.attrs[a]={from:this.target.attr(a),to:v}
return this},transform:function(o,v){if(arguments.length==1){o=this.target._parseMatrix(o)
delete o.matrix
for(v in o)
this.trans[v]={from:this.target.trans[v],to:o[v]}}else{var transform={}
transform[o]=v
this.transform(transform)}
return this},style:function(s,v){if(typeof s=='object')
for(var key in s)
this.style(key,s[key])
else
this.styles[s]={from:this.target.style(s),to:v}
return this},x:function(x){this._x={from:this.target.x(),to:x}
return this},y:function(y){this._y={from:this.target.y(),to:y}
return this},cx:function(x){this._cx={from:this.target.cx(),to:x}
return this},cy:function(y){this._cy={from:this.target.cy(),to:y}
return this},move:function(x,y){return this.x(x).y(y)},center:function(x,y){return this.cx(x).cy(y)},size:function(width,height){if(this.target instanceof SVG.Text){this.attr('font-size',width)}else{var box=this.target.bbox()
this._size={width:{from:box.width,to:width},height:{from:box.height,to:height}}}
return this},plot:function(p){this._plot=p
return this},viewbox:function(x,y,width,height){if(this.target instanceof SVG.Container){var box=this.target.viewbox()
this._viewbox={x:{from:box.x,to:x},y:{from:box.y,to:y},width:{from:box.width,to:width},height:{from:box.height,to:height}}}
return this},update:function(o){if(this.target instanceof SVG.Stop){if(o.opacity!=null)this.attr('stop-opacity',o.opacity)
if(o.color!=null)this.attr('stop-color',o.color)
if(o.offset!=null)this.attr('offset',new SVG.Number(o.offset))}
return this},during:function(during){this._during=during
return this},after:function(after){this._after=after
return this},stop:function(){clearTimeout(this.timeout)
clearInterval(this.interval)
this.attrs={}
this.trans={}
this.styles={}
delete this._x
delete this._y
delete this._cx
delete this._cy
delete this._size
delete this._plot
delete this._after
delete this._during
delete this._viewbox
return this},_at:function(o,pos){return typeof o.from=='number'?o.from+(o.to-o.from)*pos:SVG.regex.unit.test(o.to)?new SVG.Number(o.to).minus(new SVG.Number(o.from)).times(pos).plus(new SVG.Number(o.from)):o.to&&(o.to.r||SVG.Color.test(o.to))?this._color(o,pos):pos<1?o.from:o.to},_color:function(o,pos){var from,to
pos=pos<0?0:pos>1?1:pos
from=new SVG.Color(o.from)
to=new SVG.Color(o.to)
return new SVG.Color({r:~~(from.r+(to.r-from.r)*pos),g:~~(from.g+(to.g-from.g)*pos),b:~~(from.b+(to.b-from.b)*pos)}).toHex()}})
SVG.extend(SVG.Element,{animate:function(d,ease,delay){return(this.fx||(this.fx=new SVG.FX(this))).stop().animate(d,ease,delay)},stop:function(){if(this.fx)
this.fx.stop()
return this}});['click','dblclick','mousedown','mouseup','mouseover','mouseout','mousemove','mouseenter','mouseleave'].forEach(function(event){SVG.Element.prototype[event]=function(f){var self=this
this.node['on'+event]=typeof f=='function'?function(){return f.apply(self,arguments)}:null
return this}})
SVG.on=function(node,event,listener){if(node.addEventListener)
node.addEventListener(event,listener,false)
else
node.attachEvent('on'+event,listener)}
SVG.off=function(node,event,listener){if(node.removeEventListener)
node.removeEventListener(event,listener,false)
else
node.detachEvent('on'+event,listener)}
SVG.extend(SVG.Element,{on:function(event,listener){SVG.on(this.node,event,listener)
return this},off:function(event,listener){SVG.off(this.node,event,listener)
return this}})
SVG.Defs=function(){this.constructor.call(this,SVG.create('defs'))}
SVG.Defs.prototype=new SVG.Container
SVG.G=function(){this.constructor.call(this,SVG.create('g'))}
SVG.G.prototype=new SVG.Container
SVG.extend(SVG.G,{x:function(x){return x==null?this.trans.x:this.transform('x',x)},y:function(y){return y==null?this.trans.y:this.transform('y',y)}})
SVG.extend(SVG.Container,{group:function(){return this.put(new SVG.G)}})
SVG.extend(SVG.Element,{siblings:function(){return this.parent.children()},position:function(){var siblings=this.siblings()
return siblings.indexOf(this)},next:function(){return this.siblings()[this.position()+1]},previous:function(){return this.siblings()[this.position()-1]},forward:function(){var i=this.position()
return this.parent.removeElement(this).put(this,i+1)},backward:function(){var i=this.position()
if(i>0)
this.parent.removeElement(this).add(this,i-1)
return this},front:function(){return this.parent.removeElement(this).put(this)},back:function(){if(this.position()>0)
this.parent.removeElement(this).add(this,0)
return this},before:function(element){element.remove()
var i=this.position()
this.parent.add(element,i)
return this},after:function(element){element.remove()
var i=this.position()
this.parent.add(element,i+1)
return this}})
SVG.Mask=function(){this.constructor.call(this,SVG.create('mask'))
this.targets=[]}
SVG.Mask.prototype=new SVG.Container
SVG.extend(SVG.Mask,{remove:function(){for(var i=this.targets.length-1;i>=0;i--)
if(this.targets[i])
this.targets[i].unmask()
delete this.targets
this.parent.removeElement(this)
return this}})
SVG.extend(SVG.Element,{maskWith:function(element){this.masker=element instanceof SVG.Mask?element:this.parent.mask().add(element)
this.masker.targets.push(this)
return this.attr('mask','url("#'+this.masker.attr('id')+'")')},unmask:function(){delete this.masker
return this.attr('mask',null)}})
SVG.extend(SVG.Container,{mask:function(){return this.defs().put(new SVG.Mask)}})
SVG.Clip=function(){this.constructor.call(this,SVG.create('clipPath'))
this.targets=[]}
SVG.Clip.prototype=new SVG.Container
SVG.extend(SVG.Clip,{remove:function(){for(var i=this.targets.length-1;i>=0;i--)
if(this.targets[i])
this.targets[i].unclip()
delete this.targets
this.parent.removeElement(this)
return this}})
SVG.extend(SVG.Element,{clipWith:function(element){this.clipper=element instanceof SVG.Clip?element:this.parent.clip().add(element)
this.clipper.targets.push(this)
return this.attr('clip-path','url("#'+this.clipper.attr('id')+'")')},unclip:function(){delete this.clipper
return this.attr('clip-path',null)}})
SVG.extend(SVG.Container,{clip:function(){return this.defs().put(new SVG.Clip)}})
SVG.Gradient=function(type){this.constructor.call(this,SVG.create(type+'Gradient'))
this.type=type}
SVG.Gradient.prototype=new SVG.Container
SVG.extend(SVG.Gradient,{from:function(x,y){return this.type=='radial'?this.attr({fx:new SVG.Number(x),fy:new SVG.Number(y)}):this.attr({x1:new SVG.Number(x),y1:new SVG.Number(y)})},to:function(x,y){return this.type=='radial'?this.attr({cx:new SVG.Number(x),cy:new SVG.Number(y)}):this.attr({x2:new SVG.Number(x),y2:new SVG.Number(y)})},radius:function(r){return this.type=='radial'?this.attr({r:new SVG.Number(r)}):this},at:function(stop){return this.put(new SVG.Stop(stop))},update:function(block){this.clear()
block(this)
return this},fill:function(){return 'url(#'+this.attr('id')+')'},toString:function(){return this.fill()}})
SVG.extend(SVG.Defs,{gradient:function(type,block){var element=this.put(new SVG.Gradient(type))
block(element)
return element}})
SVG.extend(SVG.Container,{gradient:function(type,block){return this.defs().gradient(type,block)}})
SVG.Stop=function(stop){this.constructor.call(this,SVG.create('stop'))
this.update(stop)}
SVG.Stop.prototype=new SVG.Element
SVG.extend(SVG.Stop,{update:function(o){if(o.opacity!=null)this.attr('stop-opacity',o.opacity)
if(o.color!=null)this.attr('stop-color',o.color)
if(o.offset!=null)this.attr('offset',new SVG.Number(o.offset))
return this}})
SVG.Doc=function(element){this.parent=typeof element=='string'?document.getElementById(element):element
this.constructor.call(this,this.parent.nodeName=='svg'?this.parent:SVG.create('svg'))
this.attr({xmlns:SVG.ns,version:'1.1',width:'100%',height:'100%'}).attr('xlink',SVG.xlink,SVG.ns)
this._defs=new SVG.Defs
this.node.appendChild(this._defs.node)
if(this.parent.nodeName!='svg')
this.stage()}
SVG.Doc.prototype=new SVG.Container
SVG.extend(SVG.Doc,{stage:function(){var check,element=this,wrapper=document.createElement('div')
wrapper.style.cssText='position:relative;height:100%;'
element.parent.appendChild(wrapper)
wrapper.appendChild(element.node)
check=function(){if(document.readyState==='complete'){element.style('position:absolute;')
setTimeout(function(){element.style('position:relative;overflow:hidden;')
element.parent.removeChild(element.node.parentNode)
element.node.parentNode.removeChild(element.node)
element.parent.appendChild(element.node)
element.fixSubPixelOffset()
SVG.on(window,'resize',function(){element.fixSubPixelOffset()})},5)}else{setTimeout(check,10)}}
check()
return this},defs:function(){return this._defs},fixSubPixelOffset:function(){var pos=this.node.getScreenCTM()
this.style('left',(-pos.e%1)+'px').style('top',(-pos.f%1)+'px')}})
SVG.Shape=function(element){this.constructor.call(this,element)}
SVG.Shape.prototype=new SVG.Element
SVG.Use=function(){this.constructor.call(this,SVG.create('use'))}
SVG.Use.prototype=new SVG.Shape
SVG.extend(SVG.Use,{element:function(element){this.target=element
return this.attr('href','#'+element,SVG.xlink)}})
SVG.extend(SVG.Container,{use:function(element){return this.put(new SVG.Use).element(element)}})
SVG.Rect=function(){this.constructor.call(this,SVG.create('rect'))}
SVG.Rect.prototype=new SVG.Shape
SVG.extend(SVG.Container,{rect:function(width,height){return this.put(new SVG.Rect().size(width,height))}})
SVG.Ellipse=function(){this.constructor.call(this,SVG.create('ellipse'))}
SVG.Ellipse.prototype=new SVG.Shape
SVG.extend(SVG.Ellipse,{x:function(x){return x==null?this.cx()-this.attr('rx'):this.cx(x+this.attr('rx'))},y:function(y){return y==null?this.cy()-this.attr('ry'):this.cy(y+this.attr('ry'))},cx:function(x){return x==null?this.attr('cx'):this.attr('cx',new SVG.Number(x).divide(this.trans.scaleX))},cy:function(y){return y==null?this.attr('cy'):this.attr('cy',new SVG.Number(y).divide(this.trans.scaleY))},size:function(width,height){return this.attr({rx:new SVG.Number(width).divide(2),ry:new SVG.Number(height).divide(2)})}})
SVG.extend(SVG.Container,{circle:function(size){return this.ellipse(size,size)},ellipse:function(width,height){return this.put(new SVG.Ellipse).size(width,height).move(0,0)}})
SVG.Line=function(){this.constructor.call(this,SVG.create('line'))}
SVG.Line.prototype=new SVG.Shape
SVG.extend(SVG.Line,{x:function(x){var b=this.bbox()
return x==null?b.x:this.attr({x1:this.attr('x1')-b.x+x,x2:this.attr('x2')-b.x+x})},y:function(y){var b=this.bbox()
return y==null?b.y:this.attr({y1:this.attr('y1')-b.y+y,y2:this.attr('y2')-b.y+y})},cx:function(x){var half=this.bbox().width/2
return x==null?this.x()+half:this.x(x-half)},cy:function(y){var half=this.bbox().height/2
return y==null?this.y()+half:this.y(y-half)},size:function(width,height){var b=this.bbox()
return this.attr(this.attr('x1')<this.attr('x2')?'x2':'x1',b.x+width).attr(this.attr('y1')<this.attr('y2')?'y2':'y1',b.y+height)},plot:function(x1,y1,x2,y2){return this.attr({x1:x1,y1:y1,x2:x2,y2:y2})}})
SVG.extend(SVG.Container,{line:function(x1,y1,x2,y2){return this.put(new SVG.Line().plot(x1,y1,x2,y2))}})
SVG.Polyline=function(){this.constructor.call(this,SVG.create('polyline'))}
SVG.Polyline.prototype=new SVG.Shape
SVG.Polygon=function(){this.constructor.call(this,SVG.create('polygon'))}
SVG.Polygon.prototype=new SVG.Shape
SVG.extend(SVG.Polyline,SVG.Polygon,{morphArray:SVG.PointArray,plot:function(p){return this.attr('points',(this.points=new SVG.PointArray(p,[[0,0]])))},move:function(x,y){return this.attr('points',this.points.move(x,y))},x:function(x){return x==null?this.bbox().x:this.move(x,this.bbox().y)},y:function(y){return y==null?this.bbox().y:this.move(this.bbox().x,y)},size:function(width,height){return this.attr('points',this.points.size(width,height))}})
SVG.extend(SVG.Container,{polyline:function(p){return this.put(new SVG.Polyline).plot(p)},polygon:function(p){return this.put(new SVG.Polygon).plot(p)}})
SVG.Path=function(unbiased){this.constructor.call(this,SVG.create('path'))
this.unbiased=!!unbiased}
SVG.Path.prototype=new SVG.Shape
SVG.extend(SVG.Path,{_plot:function(data){return this.attr('d',data||'M0,0')}})
SVG.extend(SVG.Container,{path:function(data,unbiased){return this.put(new SVG.Path(unbiased)).plot(data)}})
SVG.extend(SVG.Path,{x:function(x){return x==null?this.bbox().x:this.transform('x',x)},y:function(y){return y==null?this.bbox().y:this.transform('y',y)},size:function(width,height){var scale=width/this._offset.width
return this.transform({scaleX:scale,scaleY:height!=null?height/this._offset.height:scale})},plot:function(data){var x=this.trans.scaleX,y=this.trans.scaleY
this._plot(data)
this._offset=this.transform({scaleX:1,scaleY:1}).bbox()
if(this.unbiased){this._offset.x=this._offset.y=0}else{this._offset.x-=this.trans.x
this._offset.y-=this.trans.y}
return this.transform({scaleX:x,scaleY:y})}})
SVG.Image=function(){this.constructor.call(this,SVG.create('image'))}
SVG.Image.prototype=new SVG.Shape
SVG.extend(SVG.Image,{load:function(url){return(url?this.attr('href',(this.src=url),SVG.xlink):this)}})
SVG.extend(SVG.Container,{image:function(source,width,height){width=width!=null?width:100
return this.put(new SVG.Image().load(source).size(width,height!=null?height:width))}})
var _styleAttr=('size family weight stretch variant style').split(' ')
SVG.Text=function(){this.constructor.call(this,SVG.create('text'))
this.styles={'font-size':16,'font-family':'Helvetica, Arial, sans-serif','text-anchor':'start'}
this._leading=new SVG.Number('1.2em')
this._rebuild=true}
SVG.Text.prototype=new SVG.Shape
SVG.extend(SVG.Text,{x:function(x,a){if(x==null)
return a?this.attr('x'):this.bbox().x
if(!a){a=this.style('text-anchor')
x=a=='start'?x:a=='end'?x+this.bbox().width:x+this.bbox().width/2}
if(!this.textPath)
this.lines.each(function(){if(this.newLined)this.x(x)})
return this.attr('x',x)},cx:function(x,a){return x==null?this.bbox().cx:this.x(x-this.bbox().width/2)},cy:function(y,a){return y==null?this.bbox().cy:this.y(a?y:y-this.bbox().height/2)},move:function(x,y,a){return this.x(x,a).y(y)},center:function(x,y,a){return this.cx(x,a).cy(y,a)},text:function(text){if(text==null)
return this.content
this.clear()
if(typeof text==='function'){this._rebuild=false
text(this)}else{this._rebuild=true
text=SVG.regex.isBlank.test(text)?'text':text
var i,il,lines=text.split('\n')
for(i=0,il=lines.length;i<il;i++)
this.tspan(lines[i]).newLine()
this.rebuild()}
return this},tspan:function(text){var node=this.textPath?this.textPath.node:this.node,tspan=new SVG.TSpan().text(text),style=this.style()
node.appendChild(tspan.node)
this.lines.add(tspan)
if(!SVG.regex.isBlank.test(style))
tspan.style(style)
this.content+=text
tspan.parent=this
return tspan},size:function(size){return this.attr('font-size',size)},leading:function(value){if(value==null)
return this._leading
value=new SVG.Number(value)
this._leading=value
this.lines.each(function(){if(this.newLined)
this.attr('dy',value)})
return this},rebuild:function(){var self=this
if(this._rebuild){this.lines.attr({x:this.attr('x'),dy:this._leading,style:this.style()})}
return this},clear:function(){var node=this.textPath?this.textPath.node:this.node
while(node.hasChildNodes())
node.removeChild(node.lastChild)
delete this.lines
this.lines=new SVG.Set
this.content=''
return this}})
SVG.extend(SVG.Container,{text:function(text){return this.put(new SVG.Text).text(text)}})
SVG.TSpan=function(){this.constructor.call(this,SVG.create('tspan'))}
SVG.TSpan.prototype=new SVG.Shape
SVG.extend(SVG.TSpan,{text:function(text){this.node.appendChild(document.createTextNode(text))
return this},dx:function(dx){return this.attr('dx',dx)},dy:function(dy){return this.attr('dy',dy)},newLine:function(){this.newLined=true
this.parent.content+='\n'
this.dy(this.parent._leading)
return this.attr('x',this.parent.x())}})
SVG.TextPath=function(){this.constructor.call(this,SVG.create('textPath'))}
SVG.TextPath.prototype=new SVG.Element
SVG.extend(SVG.Text,{path:function(d){this.textPath=new SVG.TextPath
while(this.node.hasChildNodes())
this.textPath.node.appendChild(this.node.firstChild)
this.node.appendChild(this.textPath.node)
this.track=this.doc().defs().path(d,true)
this.textPath.parent=this
this.textPath.attr('href','#'+this.track,SVG.xlink)
return this},plot:function(d){if(this.track)this.track.plot(d)
return this}})
SVG.Nested=function(){this.constructor.call(this,SVG.create('svg'))
this.style('overflow','visible')}
SVG.Nested.prototype=new SVG.Container
SVG.extend(SVG.Container,{nested:function(){return this.put(new SVG.Nested)}})
SVG._stroke=['color','width','opacity','linecap','linejoin','miterlimit','dasharray','dashoffset']
SVG._fill=['color','opacity','rule']
var _colorPrefix=function(type,attr){return attr=='color'?type:type+'-'+attr};['fill','stroke'].forEach(function(method){var extension={}
extension[method]=function(o){var indexOf
if(typeof o=='string'||SVG.Color.isRgb(o)||(o&&typeof o.fill==='function'))
this.attr(method,o)
else
for(index=SVG['_'+method].length-1;index>=0;index--)
if(o[SVG['_'+method][index]]!=null)
this.attr(_colorPrefix(method,SVG['_'+method][index]),o[SVG['_'+method][index]])
return this}
SVG.extend(SVG.Element,SVG.FX,extension)})
SVG.extend(SVG.Element,SVG.FX,{rotate:function(deg,x,y){return this.transform({rotation:deg||0,cx:x,cy:y})},skew:function(x,y){return this.transform({skewX:x||0,skewY:y||0})},scale:function(x,y){return this.transform({scaleX:x,scaleY:y==null?x:y})},translate:function(x,y){return this.transform({x:x,y:y})},matrix:function(m){return this.transform({matrix:m})},opacity:function(value){return this.attr('opacity',value)}})
if(SVG.Text){SVG.extend(SVG.Text,SVG.FX,{font:function(o){for(var key in o)
key=='anchor'?this.attr('text-anchor',o[key]):_styleAttr.indexOf(key)>-1?this.attr('font-'+key,o[key]):this.attr(key,o[key])
return this}})}
SVG.Set=function(){this.clear()}
SVG.SetFX=function(set){this.set=set}
SVG.extend(SVG.Set,{add:function(){var i,il,elements=[].slice.call(arguments)
for(i=0,il=elements.length;i<il;i++)
this.members.push(elements[i])
return this},remove:function(element){var i=this.members.indexOf(element)
if(i>-1)
this.members.splice(i,1)
return this},each:function(block){for(var i=0,il=this.members.length;i<il;i++)
block.apply(this.members[i],[i,this.members])
return this},clear:function(){this.members=[]
return this},valueOf:function(){return this.members}})
SVG.Set.inherit=function(){var m,methods=[]
for(var m in SVG.Shape.prototype)
if(typeof SVG.Shape.prototype[m]=='function'&&typeof SVG.Set.prototype[m]!='function')
methods.push(m)
methods.forEach(function(method){SVG.Set.prototype[method]=function(){for(var i=0,il=this.members.length;i<il;i++)
if(this.members[i]&&typeof this.members[i][method]=='function')
this.members[i][method].apply(this.members[i],arguments)
return method=='animate'?(this.fx||(this.fx=new SVG.SetFX(this))):this}})
methods=[]
for(var m in SVG.FX.prototype)
if(typeof SVG.FX.prototype[m]=='function'&&typeof SVG.SetFX.prototype[m]!='function')
methods.push(m)
methods.forEach(function(method){SVG.SetFX.prototype[method]=function(){for(var i=0,il=this.set.members.length;i<il;i++)
this.set.members[i].fx[method].apply(this.set.members[i].fx,arguments)
return this}})}
SVG.extend(SVG.Container,{set:function(){return new SVG.Set}})
SVG.extend(SVG.Element,{_memory:{},remember:function(k,v){if(typeof arguments[0]=='object')
for(var v in k)
this.remember(v,k[v])
else if(arguments.length==1)
return this._memory[k]
else
this._memory[k]=v
return this},forget:function(){if(arguments.length==0)
this._memory={}
else
for(var i=arguments.length-1;i>=0;i--)
delete this._memory[arguments[i]]
return this}})
if(typeof define==='function'&&define.amd)
define(function(){return SVG})
else if(typeof exports!=='undefined')
exports.SVG=SVG}).call(this);