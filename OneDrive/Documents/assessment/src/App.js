
import { useState, useEffect } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    beard: "",
    hijab: "",
    dob: "",
    country: "",
    state: "",
    languages: "",
    religion: "",
    description: ""
  });

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states")
      .then(res => res.json())
      .then(data => setCountries(data.data))
      .catch(err => console.log(err));
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;

    setFormData(prev => ({
      ...prev,
      country: selectedCountry,
      state: ""
    }));

    const countryObj = countries.find(c => c.name === selectedCountry);
    setStates(countryObj ? countryObj.states : []);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input name="fullname" placeholder="Full Name"
          onChange={handleChange} required /><br /><br />

        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select><br /><br />

        {formData.gender === "male" && (
          <>
            <label>Do you have a beard?</label><br />
            <select name="beard" onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select><br /><br />
          </>
        )}

        {formData.gender === "female" && (
          <>
            <label>Do you wear hijab?</label><br />
            <select name="hijab" onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select><br /><br />
          </>
        )}

        <input type="date" name="dob"
          onChange={handleChange} required /><br /><br />

        <select name="country"
          onChange={handleCountryChange}
          required>
          <option value="">Select Country</option>
          {countries.map((c, index) => (
            <option key={index} value={c.name}>{c.name}</option>
          ))}
        </select><br /><br />

        <select name="state"
          onChange={handleChange}
          value={formData.state}
          required>
          <option value="">Select State</option>
          {states.map((s, index) => (
            <option key={index} value={s.name}>{s.name}</option>
          ))}
        </select><br /><br />

        <input name="languages"
          placeholder="Languages"
          onChange={handleChange}
          required /><br /><br />

        <input name="religion"
          placeholder="Religion"
          onChange={handleChange} /><br /><br />

        <textarea name="description"
          placeholder="Describe Yourself"
          onChange={handleChange}></textarea><br /><br />

        <button type="submit">Submit</button>

      </form>
    </div>
  );
}

export default App;