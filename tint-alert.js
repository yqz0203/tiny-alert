var tinyAlert = (function () {
    var TRANSITIONTIME = 300; //动画时间
    var $alert,
        queue = [];

    function delayGenerate(cb) {
        $alert = document.querySelector('.tiny-alert');
        if (!$alert) {
            $alert = document.createElement('div');
            $alert.setAttribute('class', 'tiny-alert');
            $alert.innerHTML = 'hello world';
            document.querySelector('body').appendChild($alert);
        }
        setTimeout(cb, 50);
    }

    var SUPPORTTRANS = function () {
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'mozTransitionEnd',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (var key in transitions) {
            if (el.style[key] !== undefined) {
                return transitions[key];
            }
        }
    }();

    var triggered = false;
    var event = {
        bind: function () {
            triggered = false;
            if (SUPPORTTRANS) {
                $alert.addEventListener(SUPPORTTRANS, transitionEnd, false);
            }
            //坑爹的UC 有事件也不会触发
            setTimeout(function(){
                !triggered && transitionEnd();
            }, TRANSITIONTIME);
        },
        off: function () {
            if (SUPPORTTRANS) {
                $alert.removeEventListener(SUPPORTTRANS, transitionEnd);
            }
        }
    }

    var stayTimeout;

    function transitionEnd() {
        triggered = true;
        event.off();
        var ing = queue[0];
        //自动关闭
        if (status == 1) {
            stayTimeout = setTimeout(function () {
                event.bind();
                hide(ing);
            }, ing.stay || 2000);
        }
        else {
            queue.shift();
            if (queue[0]) {
                ing = queue[0];
                next(ing);
            }
        }
    }

    //下一个
    function next(op) {
        event.bind();
        $alert.innerHTML = op.text;
        $alert.setAttribute('class', $alert.getAttribute('class') + ' active');
        //绑定事件
        op.onClick && $alert.addEventListener('click', op.onClick);
        status = 1;
    }

    //隐藏
    function hide(op) {
        $alert.setAttribute('class', $alert.getAttribute('class').replace(' active', ''));
        //注销事件
        op.onClick && $alert.removeEventListener('click', op.onClick);
        status = 0;
    }

    //状态
    var status = 0;

    //显示
    function show(op) {
        delayGenerate(function () {
            if (typeof op === 'string')
                queue.push({
                    text: op
                });
            else queue.push(op);
            if (queue.length > 1) {
                return;
            }
            else {
                next(queue[0]);
            }
        });
    }

    return {
        show: show,
        hide: function () {
            if(queue[0]) {
                clearTimeout(stayTimeout);
                event.bind();
                hide(queue[0]);
            }
        }
    };
})();