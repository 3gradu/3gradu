const re = /(data-image="http)\S+?(&WithCrop=TRUE">)/g;
const idextract = /(\/image\/)\S+?(\/preview\/)/g;
var zip = new JSZip();

const image = document.getElementById('tutorialImage');
const text = document.getElementById('tutorialText');

var imageNumber = 1;

const guides = [
    "Enter ref number of one of your photos",
    "Click any pack type except frame only, and then pick any pack on the next page",
    "Expand the image option",
    "Press get more if needed",
    "Right click and inspect element and copy the 'body' tag element, and paste it into the next page"
]

const nextImage = () => {
    imageNumber += 1;
    text.innerText = guides[imageNumber-1];
    if (imageNumber === 6) {
        image.style.display = 'none';
        document.getElementById('prevBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
        text.style.display = 'none';
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('sourceinput').style.display = 'block';
        document.getElementById('barContainer').style.display = 'block';
        document.getElementById('barContainer').style.visibility = 'hidden';
        document.getElementById('getImgsBtn').style.display = 'block';
    } else {
        image.src = './res/' + imageNumber + '.png';
    }
}

backToTutorial = () => {
        imageNumber = 1;
        text.innerText = guides[imageNumber-1];
        image.src = './res/' + imageNumber + '.png';
        image.style.display = 'block';
        document.getElementById('prevBtn').style.display = 'block';
        document.getElementById('nextBtn').style.display = 'block';
        text.style.display = 'block';
        document.getElementById('backBtn').style.display = 'none';
        document.getElementById('sourceinput').style.display = 'none';
        document.getElementById('barContainer').style.display = 'none';
        document.getElementById('barContainer').style.visibility = 'hidden';
        document.getElementById('getImgsBtn').style.display = 'none';
}

const prevImage = () => {
    if (imageNumber > 1) {
        imageNumber -= 1;
        text.innerText = guides[imageNumber-1];
        image.src = './res/' + imageNumber + '.png';
    } 
    
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = uri;
    link.href = uri;
    link.download = name;
    link.style.display = "none";
    var evt = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": true
    });
    document.body.appendChild(link);
    link.dispatchEvent(evt);
    document.body.removeChild(link);
}
let hue = 198

const hueFade = async () => {
    let hue2 = hue-180
    document.getElementById('progressBar').style.backgroundColor = "hsl(" + hue2 + ", 100%, 50%)";
    document.getElementById('container').style.backgroundColor = "hsl(" + hue + ", 100%, 50%)";
    hue += 1;
}

const getImages = async () => {
    const bar = document.getElementById('progressBar')
    const source = document.getElementById('sourceinput').value;
    const newsource = source.replaceAll('&amp;', '&');
    const imgs = newsource.match(re);
    
    var photozip = zip.folder('photos');
    var ids = []

    if (imgs === null || imgs.length <= 0) {
        return
    }
    document.getElementById('getImgsBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('barContainer').style.visibility = 'visible';
    var disclaimer = document.createElement("p");
    disclaimer.className = 'footertext';
    disclaimer.innerText = "Livin' La Vida Loca is also not stored on these servers, enjoy x"
    document.getElementById('contact');
    document.getElementById('footer').insertBefore(disclaimer, document.getElementById('contact'));

    const percent = 100/[...new Set(imgs)].length;

    var totalprog = 0;

    var audio = new Audio('https://hitzop.com/wp-content/uploads/2021/09/Ricky_Martin_-_Livin_La_Vida_Loca.mp3');
    audio.play();

    setInterval(() => {
        hueFade();
    }, 10);
        
    await Promise.all(imgs.map(async (img) => {
        var url = img.slice(12, -2);
        const id = url.match(idextract)[0].slice(7,-9);
        url = url.replace("ProofWatermark=TRUE", "ProofWatermark=FALSE");
        if (!ids.includes(id)) {
            ids.push(id);
            url = url.replace("MaxSize=400", "MaxSize=15000");
            const res = await fetch(url);
            const imageBlob = await res.blob();
            photozip.file(id + '.jfif', imageBlob, {binary: true});
            totalprog += percent;
            bar.style.width = totalprog + '%';
        }
    }))

    totalprog += percent;
    bar.style.width = totalprog + '%';
    console.log('fetched all');

    photozip.generateAsync({type:'blob'}).then((blob) => {
        const zipObjectURL = URL.createObjectURL(blob);
        downloadURI(zipObjectURL);
    })
}