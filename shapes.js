document.addEventListener('DOMContentLoaded', (event) => {
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let shapes = [];
    let shouldGenerateShapes = false;
    let lastShapeType = -1; // Keeping track of the last shape generated

    function generateRandomShape() {
        let size = Math.random() * 500 + 100; // Random size between 100 and 600
        let color = '#' + Math.floor(Math.random()*16777215).toString(16); // Random color
        let x = Math.random() * (window.innerWidth - size); // Random x position
        let y = Math.random() * (window.innerHeight - size); // Random y position
        let rotation = Math.random() * 2 * Math.PI; // Random rotation

        let type;
        do {
            type = Math.floor(Math.random() * 3); // 0 for square, 1 for circle, 2 for triangle
        } while(type === lastShapeType);

        lastShapeType = type;
        
        return {x, y, size, color, type, rotation};
    }

    function drawShape(shape) {
        ctx.save();
        ctx.translate(shape.x + shape.size / 2, shape.y + shape.size / 2);
        ctx.rotate(shape.rotation);
        ctx.translate(-shape.size / 2, -shape.size / 2);
        ctx.fillStyle = shape.color;
        switch(shape.type) {
            case 0:
                ctx.fillRect(0, 0, shape.size, shape.size);
                break;
            case 1:
                ctx.beginPath();
                ctx.arc(shape.size / 2, shape.size / 2, shape.size / 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(shape.size / 2, 0);
                ctx.lineTo(shape.size, shape.size);
                ctx.lineTo(0, shape.size);
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }

    function removeShape(x, y) {
        shapes = shapes.filter(shape => {
            let dx = x - (shape.x + shape.size / 2);
            let dy = y - (shape.y + shape.size / 2);
            let distance = Math.sqrt(dx * dx + dy * dy);
            return distance > shape.size / 2;
        });
    }

    function drawShapes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let shape of shapes) {
            drawShape(shape);
        }
    }

    setInterval(function() {
        if(shouldGenerateShapes && shapes.length < 15) {
            shapes.push(generateRandomShape());
        }
        drawShapes();
    }, 1000); // Add a new shape every second, up to 15 shapes

    let timer;

    document.addEventListener('mousemove', function(event) {
        shouldGenerateShapes = false;
        clearTimeout(timer);
        removeShape(event.clientX, event.clientY);
        drawShapes();

        timer = setTimeout(function() {
            shouldGenerateShapes = true;
        }, 5000); // Reset after 5 seconds of inactivity
    });
});
