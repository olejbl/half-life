import { useEffect, useState } from "react";

const NicotineHalfLife = () => {
  function calculateNicotineAndCotinineConcentration(
    smokingFrequency: number, // Number of cigarettes smoked per day
    nicotineAmount: number, // Amount of nicotine per cigarette (in milligrams)
    halfLifeNicotine: number, // Half-life of nicotine in the body (in hours)
    halfLifeCotinine: number, // Half-life of cotinine in the body (in hours)
    timeSinceLastCigarette: number // Time since last cigarette (in hours)
  ): { nicotineConcentration: number; cotinineConcentration: number } {
    const nicotineMetabolismRate = Math.log(2) / halfLifeNicotine;
    const cotinineMetabolismRate = Math.log(2) / halfLifeCotinine;
    const cigarettesPerHour = smokingFrequency / 24; // Assuming a 24-hour day

    // Calculate the concentration of nicotine and cotinine
    const nicotineConcentration =
      ((nicotineAmount * cigarettesPerHour) /
        (1 - Math.exp(-nicotineMetabolismRate))) *
      (Math.exp(-nicotineMetabolismRate * timeSinceLastCigarette) -
        Math.exp(-nicotineMetabolismRate * (timeSinceLastCigarette + 1)));

    const cotinineConcentration =
      ((nicotineAmount * cigarettesPerHour) /
        (1 - Math.exp(-nicotineMetabolismRate))) *
      (Math.exp(-cotinineMetabolismRate * timeSinceLastCigarette) -
        Math.exp(-cotinineMetabolismRate * (timeSinceLastCigarette + 1)));

    return { nicotineConcentration, cotinineConcentration };
  }

  const [freq, setFreq] = useState(10);
  const [mgPer, setMgPer] = useState(17);
  const [halfNic, setHalfNic] = useState(2);
  const [halfCot, setHalfCot] = useState(17);
  const [timeSince, setTimeSince] = useState(17);
  const [concentration, setConcentration] = useState(
    calculateNicotineAndCotinineConcentration(freq, mgPer, halfNic, halfCot, 1)
  );

  useEffect(() => {
    setConcentration(
      calculateNicotineAndCotinineConcentration(
        freq,
        mgPer,
        halfNic,
        halfCot,
        1
      )
    );
  }, [freq, halfCot, halfNic, mgPer]);

  const graph = () => {
    const arr = [];
    for (let i = 0; i < 500; i++) {
      arr.push(
        <p key={i}>
          H{i}, N:{" "}
          {
            calculateNicotineAndCotinineConcentration(
              freq,
              mgPer,
              halfNic,
              halfCot,
              i
            ).nicotineConcentration
          }
        </p>
      );
    }
    return arr;
  };

  return (
    <>
      <div>
        <p>Playground</p>
        <div>
          <div className="grid grid-cols-2 bg-white">
            <label>Number of cigarettes smoked per day {freq} </label>
            <input
              type="range"
              min="0"
              max="24"
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              className="slider"
              id="freq"
            />
            <label>
              Amount of nicotine per cigarette (in milligrams) {mgPer}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={mgPer}
              onChange={(e) => setMgPer(Number(e.target.value))}
              className="slider"
              id="mgPer"
            />
            <label>
              Half-life of nicotine in the body (in hours) {halfNic}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={halfNic}
              onChange={(e) => setHalfNic(Number(e.target.value))}
              className="slider"
              id="halfNic"
            />
            <label>
              Half-life of cotinine in the body (in hours) {halfCot}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={halfCot}
              onChange={(e) => setHalfCot(Number(e.target.value))}
              className="slider"
              id="halfCot"
            />
            <label>Time since last (in hours) {timeSince}</label>
            <input
              type="range"
              min="1"
              max="500"
              value={timeSince}
              onChange={(e) => setTimeSince(Number(e.target.value))}
              className="slider"
              id="timeSince"
            />
          </div>
          <h1>Concentration:</h1>
          <p>{concentration.cotinineConcentration} cotinine</p>
          <p>{concentration.nicotineConcentration} nicotine</p>
        </div>
      </div>
      {graph()}
    </>
  );
};

export default NicotineHalfLife;
