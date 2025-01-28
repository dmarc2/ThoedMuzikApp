import axios from 'axios';
import $ from 'jquery';

export default function Newsletter() { 
  const handleSubmit = (event) => {
    event.preventDefault();
    const url = 'http://localhost:3000/api/newsletter/submit/' + $("#newsletter-email").val(); // Replace with your backend endpoint
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: $("#newsletter-email").val() }), // Assuming 'name' is the form input value
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          console.log('Form submitted successfully');
        } else {
          console.error('Form submission failed');
        }
      })
      .catch((error) => console.error('Error submitting form', error));
  };

  return (
    <section id='newsletter-sect'>
        <h2 className='section-title'>NewsLetter</h2>
        <div>
          <p>Sign up to our News Letter for Updates.</p>

          <form onSubmit={handleSubmit}>
            <input type='email' placeholder='Enter your email' id='newsletter-email' name='newsletter-email'></input>
            <input type='submit' value='Submit'></input>
          </form>
        </div>
    </section>
  );
}