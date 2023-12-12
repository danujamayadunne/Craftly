import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import labstyles from '@/styles/Home.module.css'

// Font Options
const fontOptions = [
    'Arial, sans-serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Helvetica, sans-serif',
    'Impact, sans-serif',
    'Poppins, sans-serif',
    'Times New Roman, serif',
    'Verdana, sans-serif',
    'Gemunu Libre, sans-serif',
];

export default function Home() {

    // Image Download
    const canvasRef = useRef(null);

    const handleDownload = () => {
        const image = new Image();
        image.src = uploadedImage;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');

            // Image Canvas with Post Text
            ctx.font = `${fontWeight} ${fontSize * 2}px ${selectedFont}`;
            ctx.fillStyle = fontColor;
            ctx.drawImage(image, 0, 0, 1080, 1080);
            ctx.textAlign = 'center';
            const textX = canvas.width / 2;
            let textY = 910;

            // Text Break
            postText.split('\n').forEach((line) => {
                ctx.fillText(line, textX, textY);
                textY += fontSize + 50;
            });

            // Image Download Button
            const downloadLink = document.createElement('a');
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.download = 'image.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
    };

    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [postText, setPostText] = useState('');
    const [fontColor, setFontColor] = useState('#000000');
    const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
    const [fontSize, setFontSize] = useState(16);
    const [fontWeight, setFontWeight] = useState(300);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {

        // Mobile Warning
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    // Image Upload From Local
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    // Image Upload From URL
    const handleUrlImage = () => {
        if (imageUrl) {
            setUploadedImage(imageUrl);
        }
    };

    // Image Remove
    const handleRemoveImage = () => {
        setUploadedImage(null);
        setImageUrl('');
    };

    return (
        <>
            <Head>
                <title>Craftly Post</title>
                <meta name="description" content="PostCraftly - Craft Your Posts Swiftly" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            {/* Mobile Warning */}
            {isMobile && (
                <div className={labstyles.mobileWarning}>
                    For best experience, <br /> please switch to desktop view.
                </div>
            )}

            {/* Main Section */}
            <section className={labstyles.main_section}>
                <div className={`container-fluid ${labstyles.main_div}`}>
                    <div className={`${labstyles.main_card}`}>
                        <div className={`container text-center ${labstyles.main_row}`}>
                            <div className="row gy-5">

                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                                {/* Image Preview Col - 1*/}
                                <div className="col-sm">

                                    {/* Image Card */}
                                    <div className={`${labstyles.image_upload_card}`}>
                                        {uploadedImage && (
                                            <>
                                                <img src={uploadedImage} className={labstyles.image_preview} />
                                                <div className={labstyles.preview_text} style={{ fontFamily: selectedFont, color: fontColor, fontSize: `${fontSize}px`, fontWeight: fontWeight }}>
                                                    {postText}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className={`${labstyles.image_upload_button}`}>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" style={{ display: 'none' }} id="imageUploader" />
                                        <label htmlFor="imageUploader" className="btn btn-outline-primary btn-sm rounded-pill"><i className="bi bi-file-earmark-image"></i> Upload Image </label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {/* Url Import is currently disabled for Proxy Issue */}
                                        <button type="button" onClick={handleUrlImage} className="btn btn-outline-dark btn-sm rounded-pill disabled"><i className="bi bi-link"></i> From URL</button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <button type="button" onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm rounded-pill"><i className="bi bi-trash"></i> Remove Image </button>
                                        &nbsp;&nbsp;
                                        <div className={labstyles.image_url_div}><input type="text" placeholder="Paste image URL here" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={`form-control rounded-pill mt-2 ${labstyles.image_url}`} style={{ display: 'inline-block', width: '80%', boxShadow: 'none', outline: 'none' }} /></div>
                                    </div>
                                </div>

                                {/* Form Col - 2 */}
                                <div className="col-sm">

                                    {/* Post Text */}
                                    <div className={`mb-3 ${labstyles.element}`}>
                                        <label htmlFor="formGroupExampleInput" className="form-label">Post Text</label>
                                        <textarea type="text" className={`form-control rounded-pill ${labstyles.post_text}`} id="formGroupExampleInput" placeholder="Type your post text here" style={{ boxShadow: 'none', outline: 'none' }} value={postText} onChange={(e) => setPostText(e.target.value)} rows="4" />
                                    </div>

                                    {/* Font Selector */}
                                    <div className={`${labstyles.element}`} style={{ paddingTop: '2px' }}>
                                        <label htmlFor="fontSelector" className="form-label">Select Font</label>
                                        <select id="fontSelector" className="form-select rounded-pill" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} style={{ boxShadow: 'none', outline: 'none' }}>
                                            {fontOptions.map((font, index) => (
                                                <option key={index} value={font}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Font Size */}
                                    <div className={`${labstyles.element}`} style={{ paddingTop: '19px' }}>
                                        <label htmlFor="fontSizeInput" className="form-label">Font Size</label>
                                        <input type="text" id="fontSizeInput" className="form-control rounded-pill" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ boxShadow: 'none', outline: 'none' }} />
                                    </div>

                                    {/* Font Weight */}
                                    <div className={`${labstyles.element}`} style={{ paddingTop: '19px' }}>
                                        <label htmlFor="fontWeightInput" className="form-label"> Font Weight </label>
                                        <input type="text" id="fontWeightInput" className="form-control rounded-pill" value={fontWeight} onChange={(e) => setFontWeight(Number(e.target.value))} style={{ boxShadow: 'none', outline: 'none' }} />
                                    </div>

                                    {/* Font Color */}
                                    <div className={`${labstyles.element}`} style={{ paddingTop: '19px' }}>
                                        <label htmlFor="formGroupExampleInput" className="form-label">Font Color</label><br />
                                        <input type="color" id="favcolor" name="favcolor" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
                                    </div>

                                    {/* Download Button */}
                                    <button type="button" onClick={handleDownload} style={{ marginTop: '90px' }} className={`btn btn-outline-success btn-sm rounded-pill ${labstyles.download}`}><i className="bi bi-download"></i> Download Image </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}