import { useEffect } from "react";
import $ from 'jquery';
import "./slideshow.css";

export function SlideShow({slides}) {
    let currentIndex = 0;

    useEffect(()=> {
        if(slides === null || slides.length == 0) {
            $("#noslides_message").remove();
            $('.hero-placeholder').prepend("<p id='noslides_message'>No highlighted content.</p>");
        }
        else {
            $("#noslides_message").remove();
            showCurrentSlide();
        }
    });

    function showCurrentSlide() {
        if(slides === null || slides.length == 0) return;

        const imageUrl = `url(${slides[currentIndex].image})`;
        
        $('.hero-placeholder').css({
            'backgroundImage': imageUrl,
            'backgroundPosition': 'center',
            'backgroundSize': 'cover',
            'backgroundRepeat': 'no-repeat'
        });

        $(".hero-img").remove();
        $(".hero-heading").remove();
        $('.hero-placeholder').prepend(
            '<img class="hero-img" src="' + slides[currentIndex].image + '" alt="An image"></img>' +
            '<p class="hero-heading">' + slides[currentIndex].heading + '</p>'
        )

        $(".index-wheel> .dot:nth-child("+(currentIndex+1)+")").addClass("selected");
    }

    function goToPrevSlide() {
        if(slides !== null && 0 <= (currentIndex - 1) && (currentIndex - 1) < slides.length) {
            $(".index-wheel> .dot.selected").removeClass("selected");
            currentIndex = (currentIndex - 1);
        }
        showCurrentSlide();
    } 

    function goToNextSlide() {
        if(slides !== null && 0 <= (currentIndex + 1) && (currentIndex + 1) < slides.length) {
            $(".index-wheel> .dot.selected").removeClass("selected");
            currentIndex = (currentIndex + 1);
        }
        showCurrentSlide();
    } 
    return (
        <section id="slideshow">
            <div className='left-btn-style1' onClick={goToPrevSlide}>&lt;</div>
            <div className="hero-placeholder">

            <div className='index-wheel'>
                <div className='dot selected'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
            </div>
            <div className="overlay"></div>
            </div>
            <div className='right-btn-style1' onClick={goToNextSlide}>&gt;</div>
        </section>
    );
}