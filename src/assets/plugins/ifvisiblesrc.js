function d(el) {
                  return document.getElementById(el);
                }
                ifvisible.setIdleDuration(900);
                ifvisible.on('statusChanged', function (e) {
                  //d("result").innerHTML += (e.status + "<br>");
                });

                var timer;
                ifvisible.idle(function () {
                     if(window.location.href.split('/')[3] != 'login'){
                         timer = setTimeout(log_out, 300000);
                    }                  
                  document.body.style.opacity = 0.5;
                  
                });
                ifvisible.wakeup(function () {
                  clearTimeout(timer);
                  document.body.style.opacity = 1;
                });
                ifvisible.onEvery(0.5, function () {
                  // Clock, as simple as it gets
                  var h = (new Date()).getHours();
                  var m = (new Date()).getMinutes();
                  var s = (new Date()).getSeconds();
                  h = h < 10 ? "0" + h : h;
                  m = m < 10 ? "0" + m : m;
                  s = s < 10 ? "0" + s : s;
                  // Update clock
                  // d("result3").innerHTML = (h+':'+m+':'+s);
                });
                setInterval(function () {
                  var info = ifvisible.getIdleInfo();
                  // Give 3% margin to stabilaze user output
                  if (info.timeLeftPer < 3) {
                    info.timeLeftPer = 0;
                    info.timeLeft = ifvisible.getIdleDuration();
                  }
                  //d("seconds").innerHTML = parseInt(info.timeLeft / 1000), 10;
                  d("barTime").style.width = info.timeLeftPer + '%';
                }, 100);

                function log_out() { 
                  //window.location.href = './lockScreen';
                    setTimeout(function(){window.location.href = './';}, 60000);
                  
                }