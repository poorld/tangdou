// 糖豆_7.9.4.apk


function stack() {
    console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));//java打印堆栈
}
function printObj(obj) {
    if (obj === null) {
        return;
    }

    console.log("Dump all fields value for  " + obj.getClass() + " :");

    var cls = obj.getClass();

    while (cls !== null && !cls.equals(Java.use("java.lang.Object").class)) {
        var fields = cls.getDeclaredFields();
        if (fields === null || fields.length === 0) {
            cls = cls.getSuperclass();
            continue;
        }

        if (!cls.equals(obj.getClass())) {
            console.log("Dump super class  " + cls.getName() + " fields:");
        }

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            field.setAccessible(true);
            var name = field.getName();
            var value = field.get(obj);
            var type = field.getType();
            console.log(type + " " + name + "=" + value);
        }

        cls = cls.getSuperclass();
    }
}

var Color = {
    RESET: "\x1b[39;49;00m", Black: "0;01", Blue: "4;01", Cyan: "6;01", Gray: "7;11", Green: "2;01", Purple: "5;01", Red: "1;01", Yellow: "3;01",
    Light: {
        Black: "0;11", Blue: "4;11", Cyan: "6;11", Gray: "7;01", Green: "2;11", Purple: "5;11", Red: "1;11", Yellow: "3;11"
    }
};

var LOG = function (input, kwargs) {
    kwargs = kwargs || {};
    var logLevel = kwargs['l'] || 'log', colorPrefix = '\x1b[3', colorSuffix = 'm';
    if (typeof input === 'object')
        input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
    if (kwargs['c'])
        input = colorPrefix + kwargs['c'] + colorSuffix + input + Color.RESET;
    console[logLevel](input);
};

function traceMethod(targetClassMethod) {
    var delim = targetClassMethod.lastIndexOf('.');
    if (delim === -1)
        return;
    var targetClass = targetClassMethod.slice(0, delim);
    var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length);
    var hook = Java.use(targetClass);    
    var overloadCount = hook[targetMethod].overloads.length;
    LOG({ Hooked: targetClassMethod, overloaded: overloadCount }, { c: Color.Green });
    for (var i = 0; i < overloadCount; i++) {
        hook[targetMethod].overloads[i].implementation = function ()
         {
            var log = { '#': targetClassMethod, args: [] };
            for (var j = 0; j < arguments.length; j++) {
                var arg = arguments[j];               
               if (j === 0 && arguments[j]) {
                    if (arguments[j].toString() === '[object Object]') {
                        var s = [];
                        for (var k = 0, l = arguments[j].length; k < l; k++) {
                            s.push(arguments[j][k]);
                        }
                        arg = s.join('');
                    }
                }
                log.args.push({ i: j, o: arg, s: arg ? JSON.stringify(arg) : 'null'});
            }

            var retval;
            try {               
                 retval = this[targetMethod].apply(this, arguments);      
                 log.returns = { val: retval, str: retval ? JSON.stringify(retval) : null };             
            } catch (e) {
                console.error(e);
            }
            LOG(log, { c: Color.Yellow });
         return retval;      
        }
        
    }
}


function uniqBy(array, key) {
    var seen = {};
    return array.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}

function traceClass(targetClass)
{
    Java.perform(function() {
    //Java.use是新建一个对象哈，大家还记得么？
        var hook = Java.use(targetClass);
    //利用反射的方式，拿到当前类的所有方法
        var methods = hook.class.getDeclaredMethods();
    //建完对象之后记得将对象释放掉哈
        hook.$dispose;
    //将方法名保存到数组中
        var parsedMethods = [];
        methods.forEach(function(method) {
            parsedMethods.push(method.toString().replace(targetClass + ".","TOKEN").match(/\sTOKEN(.*)\(/)[1]);
        });
        console.log(parsedMethods)
        // 去掉一些重复的值
        var targets = uniqBy(parsedMethods, JSON.stringify);
        // 对数组中所有的方法进行hook，traceMethod也就是第一小节的内容
        targets.forEach(function(targetMethod) {
            traceMethod(targetClass + "." + targetMethod);
        });
    })
}
// 秘钥
// setImmediate(traceClass("com.bokecc.basic.utils.bc")) 
// setImmediate(signKey)
function signKey() {
    Java.perform(function() {
        let bc = Java.use('com.bokecc.basic.utils.bc')
        bc.a.implementation = function() {
            console.log('bc.a');
            stack();
            return this.a()
        }
    })
}

// 日志
// setImmediate(traceClass("com.bokecc.basic.utils.an")) 

// AES/CBC/PKCS5Padding 加解密
// com.bokecc.basic.utils.y.e
// setImmediate(traceClass('com.bokecc.basic.utils.y'))
// setImmediate(decrpty)
function decrpty() {
    Java.perform(function() {
        let utilsY = Java.use('com.bokecc.basic.utils.y')
        utilsY.e.implementation = function(encrpty) {
            let decrptyRes = this.e(encrpty)
            console.log('encrpty=', encrpty);
            console.log('decrpty=', decrptyRes);
            stack();
            return decrptyRes;
        }
    })
}

// setImmediate(traceClass('com.bokecc.dance.player.DancePlayActivity'))
// setImmediate(dancePlay)
function dancePlay() {
    Java.perform(function() {
        let dance = Java.use('com.bokecc.dance.player.DancePlayActivity')
        dance.e.overload('java.lang.String').implementation = function(url) {
            stack();
            console.log(url);
            this.e(url);
        }
    })
}

// setImmediate(traceClass('com.bokecc.basic.rpc.c'))

// 请求
// setImmediate(traceClass('com.bokecc.basic.rpc.m'))
// setImmediate(response)
// function response() {
//     Java.perform(function() {
//         // com.bokecc.basic.rpc.m.g
//         let m = Java.use('com.bokecc.basic.rpc.m')
//         m.g.implementation = function
//     })
// }

// 响应
// setImmediate(request)
// function request() {
//     Java.perform(function() {
//         let c = Java.use('com.bokecc.basic.rpc.c')
//         c.onNext.implementation = function(model) {
//             console.log('onNext');
//             let m = Java.cast(model, Java.use('com.tangdou.datasdk.model.BaseModel'))
//             console.log('getDatas', m.getDatas());
//             console.log('getParam', m.getParam());
//         }
//     })
// }
// setImmediate(traceClass('com.bokecc.basic.rpc.n'))

// setImmediate(traceClass('com.tangdou.datasdk.model.BaseModel'))
// setImmediate(traceClass('com.tangdou.datasdk.client.HttpClientUtilexit'))
// setImmediate(traceClass('com.bokecc.basic.rpc.c'))

    
// API接口
// com.tangdou.datasdk.service.BasicService
// setImmediate(traceClass('com.tangdou.datasdk.service.BasicService'))




// 我的收藏
// public final void a(String str, String str2, int i, boolean z) {
//     com.bokecc.basic.rpc.p.e().a((com.bokecc.basic.rpc.l) null, com.bokecc.basic.rpc.p.a().getFavVideos(str, str2, i), new d(z, this, i, str2));
// }




// setImmediate(traceClass('com.bokecc.basic.rpc.p'))

setImmediate(function() {
    Java.perform(function() {
        var targetClass='com.bokecc.dance.activity.collect.b$d';
        var methodName='onSuccess';
        var gclass = Java.use(targetClass);
        gclass[methodName].overload('java.lang.Object','com.bokecc.basic.rpc.e$a').implementation = function(arg0,arg1) {
            // console.log('\nGDA[Hook onSuccess(java.lang.Object,com.bokecc.basic.rpc.e$a)]'+'\n\targ0 = '+arg0+'\n\targ1 = '+arg1);
            var i=this[methodName](arg0,arg1);
            // console.log('\treturn '+i);
            // let videoModel = arg0.get(0)
            let list = Java.cast(arg0, Java.use('java.util.ArrayList'))
            // console.log(list.size());
            for (let i = 0; i < list.size(); i++) {
                let model = Java.cast(list.get(i), Java.use('com.tangdou.datasdk.model.VideoModel'))
                let definitionModel = Java.cast(model.playurl.value, Java.use('com.tangdou.datasdk.model.DefinitionModel'))
                // console.log('\n\n' + model.getTitle());
                // printObj(definitionModel)
                let hd = definitionModel.hd.value != null
                hd && printUrl('hd', definitionModel.hd.value)
                
                let sd = definitionModel.sd.value != null
                !hd && sd && printUrl('sd', definitionModel.sd.value)

                let ud = definitionModel.ud.value != null
                !hd && !sd && ud && printUrl('ud', definitionModel.ud.value)

                // console.log(definitionModel);
            }
            return i;
        }
    })
    })
    
function printUrl(type, list) {
    if (list == null) return
    let list1 = Java.cast(list, Java.use('java.util.List'))
    let decrpty = Java.use('com.bokecc.basic.utils.y')

    // for (let i = 0; i < list1.size(); i++) {
    //     let url = Java.cast(list1.get(i), Java.use('com.tangdou.datasdk.model.PlayUrl'))
    //     console.log('\n\n------------' + i + '------------------');
    //     console.log('cdn_source', url.cdn_source.value);
    //     console.log('download',url.download.value);
    //     console.log('url',url.url.value);
    //     // printObj(url)
    //     let edc = decrpty.e(url.download.value)
    //     console.log('解密', edc);
    // }
    let url = Java.cast(list1.get(0), Java.use('com.tangdou.datasdk.model.PlayUrl'))
    let downloadUrl = decrpty.e(url.download.value)
    // console.log(type,downloadUrl);
    console.log(downloadUrl);
}


// 拦截响应
// setImmediate(function() {
//     Java.perform(function() {
//         var targetClass='com.tangdou.datasdk.app.ApiClient$1';
//         var methodName='intercept';
//         var gclass = Java.use(targetClass);
//         gclass[methodName].overload('okhttp3.Interceptor$Chain').implementation = function(arg0) {
//             console.log('\nGDA[Hook intercept(okhttp3.Interceptor$Chain)]'+'\n\targ0 = '+arg0);
//             var resp=this[methodName](arg0);
//             let respClass = Java.use('okhttp3.Response')
//             let response = Java.cast(resp, respClass)
//             // console.log(resp.body);
//             // okhttp3.internal.http.RealResponseBody
//             let result = response.body().string()
//             console.log(result);
//             return resp;
//         }
//     })
//     })
    
    



