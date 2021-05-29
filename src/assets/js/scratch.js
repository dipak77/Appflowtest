(function () {

    // 'use strict';

    var isDrawing, lastPoint;
    var container = document.getElementById('js-container'),
        canvas = document.getElementById('js-canvas');
    if(canvas)
    {
        var   canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        ctx = canvas.getContext('2d'),
        image = new Image(),
        brush = new Image();

    // base64 Workaround because Same-Origin-Policy
    // image.crossOrigin = "Anonymous";
    image.src = '../assets/imgs/win-en.png';
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
        // Show the form when Image is loaded.
        document.querySelectorAll('.form')[0].style.visibility = 'visible';
    };
    brush.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5NjlDQTYzNzU0NzExRTlBRDZBRkQ4RjAxMDc1OTA5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5NjlDQTY0NzU0NzExRTlBRDZBRkQ4RjAxMDc1OTA5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTk2OUNBNjE3NTQ3MTFFOUFENkFGRDhGMDEwNzU5MDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTk2OUNBNjI3NTQ3MTFFOUFENkFGRDhGMDEwNzU5MDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz614aLZAAACB0lEQVR42uSaPU8CMRjHT6ImRDdRIrqYiAKzia74ARB3ZxNGBhz0M+iizizGr8GqAZFNjCbOviQGTxkMOfzXtElzHspLe3dPfZLfROj1R3ulz9NaliExprCtOZAFGyAFlsAsmOKff4Bn8ACa4AJUwFMYfogZUARV4IDugDj8u0Xelu8xDw7B+xCd7wUbsWOQ8ENgHJSArVDAjc2fMaFLIgnqGgXcXIOMaokt0PJRQh6dvCqJXdAJQELQ4X0YKQoBCrgpDCuRC3gkvEYmN6hEWvPKNMo7k+5Xgi17jRBKCBr9Ls2lEEsI9v6SSIR0SnlNsV93ACcEJASnvSRioE1IpM37/B0RSWQHRAmlIFHe5x9RIzQagqpXUuQQFHHESy+m1qbibNHPDDcri6wTTtfXZJEUYZFVWWSZsEhSFokTFonL5aAu9bJWxIDa3Kc8tWzCIrYs8khY5FUWuScscieLNAmL3Moil4RFrtxrMelNI/VtfM0rsTojOK3OjU51X0CZ0GiUeZ/NLgcZU6ATJdN6iCXq1gCnWSxZaYVQ4g2s/MtjBRFGHPSIMOLoTUTeCu4wdFtHtcLP1Ywd6GR0/ZtOgn3NWxnW9gF/lvZYAEeW+isc7HxmMYj9Dtu0Ffl2ethLNTXeRmzUIrDKQlmW15HZyau45jTNP2ejJ6453fCstEK88KE+vgQYAKZJW0LpKafkAAAAAElFTkSuQmCC';

    canvas.addEventListener('mousedown', handleMouseDown, false);
    canvas.addEventListener('touchstart', handleMouseDown, false);
    canvas.addEventListener('mousemove', handleMouseMove, false);
    canvas.addEventListener('touchmove', handleMouseMove, false);
    canvas.addEventListener('mouseup', handleMouseUp, false);
    canvas.addEventListener('touchend', handleMouseUp, false);
    }

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    // Only test every `stride` pixel. `stride`x faster,
    // but might lead to inaccuracy
    function getFilledInPixels(stride) {
        if (!stride || stride < 1) { stride = 1; }

        var pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
            pdata = pixels.data,
            l = pdata.length,
            total = (l / stride),
            count = 0;

        // Iterate over all pixels
        for (var i = count = 0; i < l; i += stride) {
            if (parseInt(pdata[i]) === 0) {
                count++;
            }
        }

        return Math.round((count / total) * 100);
    }

    function getMouse(e, canvas) {
        var offsetX = 0, offsetY = 0, mx, my;

        if (canvas.offsetParent !== undefined) {
            do {
                offsetX += canvas.offsetLeft;
                offsetY += canvas.offsetTop;
            } while ((canvas = canvas.offsetParent));
        }

        mx = (e.pageX || e.touches[0].clientX) - offsetX;
        my = (e.pageY || e.touches[0].clientY) - offsetY;

        return { x: mx, y: my };
    }

    function handlePercentage(filledInPixels) {
        filledInPixels = filledInPixels || 0;
        console.log(filledInPixels + '%');
        if (filledInPixels > 50) {
            if(canvas.parentNode){
                
                canvas.parentNode.removeChild(canvas);
            }
        }
    }

    function handleMouseDown(e) {
        isDrawing = true;
        lastPoint = getMouse(e, canvas);
    }

    function handleMouseMove(e) {
        if (!isDrawing) { return; }

        e.preventDefault();

        var currentPoint = getMouse(e, canvas),
            dist = distanceBetween(lastPoint, currentPoint),
            angle = angleBetween(lastPoint, currentPoint),
            x, y;

        for (var i = 0; i < dist; i++) {
            x = lastPoint.x + (Math.sin(angle) * i) - 25;
            y = lastPoint.y + (Math.cos(angle) * i) - 25;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(brush, x, y);
        }

        lastPoint = currentPoint;
        handlePercentage(getFilledInPixels(32));
    }

    function handleMouseUp(e) {
        isDrawing = false;
    }
})();