import React, { useState, useEffect } from 'react';
import { Sun, Zap, Droplets, Heart, Award, TrendingUp, Leaf, Wind } from 'lucide-react';

const Evibe = () => {
  const [gameState, setGameState] = useState('welcome');
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [playerChoices, setPlayerChoices] = useState([]);
  const [badges, setBadges] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const [purchaseIntention, setPurchaseIntention] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const scenarios = [
    { id: 1, text: "You need to travel 6 km to college.", distance: 6 },
    { id: 2, text: "Quick 3 km trip to the grocery store.", distance: 3 },
    { id: 3, text: "8 km commute to work in the morning.", distance: 8 },
    { id: 4, text: "5 km ride to meet friends at a café.", distance: 5 },
    { id: 5, text: "10 km journey to the city center.", distance: 10 }
  ];

  const transportOptions = [
    {
      id: 'evibe',
      name: 'Solar E-Bike (E-VIBE)',
      icon: '🚴',
      color: '#10b981',
      points: 15,
      costPerKm: 0,
      emissions: 0,
      energy: 'Solar (Renewable)',
      health: 'Excellent - Active transport',
      bgGradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'scooter',
      name: 'Petrol Scooter',
      icon: '🛵',
      color: '#f59e0b',
      points: 2,
      costPerKm: 2.5,
      emissions: 60,
      energy: 'Fossil Fuel',
      health: 'Low - Sedentary',
      bgGradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 'car',
      name: 'Car',
      icon: '🚗',
      color: '#ef4444',
      points: 2,
      costPerKm: 5,
      emissions: 120,
      energy: 'Fossil Fuel',
      health: 'Very Low - Sedentary',
      bgGradient: 'from-red-500 to-rose-600'
    }
  ];

  const quizQuestion = {
    question: "Which transport option uses 100% renewable energy?",
    options: [
      { id: 'a', text: 'Petrol Scooter', correct: false },
      { id: 'b', text: 'Solar Electric Bicycle', correct: true },
      { id: 'c', text: 'Electric Car (Grid Charging)', correct: false },
      { id: 'd', text: 'Car', correct: false }
    ]
  };

  const handleChoice = (optionId) => {
    const option = transportOptions.find(o => o.id === optionId);
    const scenario = scenarios[currentRound];
    
    const choice = {
      round: currentRound + 1,
      scenario: scenario.text,
      choice: option.name,
      points: option.points,
      cost: (option.costPerKm * scenario.distance).toFixed(2),
      emissions: option.emissions * scenario.distance,
      timestamp: new Date().toISOString()
    };

    setPlayerChoices([...playerChoices, choice]);
    setScore(score + option.points);
    setLastChoice({ ...choice, option });
    setShowFeedback(true);
  };

  const nextRound = () => {
    setShowFeedback(false);
    if (currentRound === 2 && !quizAnswered) {
      // Before starting the quiz, collect user name & email
      setGameState('collectInfo');
    } else if (currentRound < scenarios.length - 1) {
      setCurrentRound(currentRound + 1);
      setGameState('playing');
    } else {
      calculateBadges();
      setGameState('results');
    }
  };

  const handleQuizAnswer = (optionId) => {
    const option = quizQuestion.options.find(o => o.id === optionId);
    setQuizAnswer(optionId);
    if (option.correct) {
      setScore(score + 10);
    }
    setQuizAnswered(true);
    // Share quiz answer along with user info and current game data
    setTimeout(() => {
      sendDataToEmail();
    }, 500);

    setTimeout(() => {
      setCurrentRound(currentRound + 1);
      setGameState('playing');
    }, 2000);
  };

  const calculateBadges = () => {
    const evibeChoices = playerChoices.filter(c => c.choice.includes('E-VIBE')).length;
    const newBadges = [];
    
    if (evibeChoices >= 4) {
      newBadges.push({ name: 'Solar Hero', icon: '🏆', description: 'Chose E-VIBE 4+ times' });
    }
    if (evibeChoices === 5) {
      newBadges.push({ name: 'Eco Champion', icon: '🌟', description: 'Perfect eco-score!' });
    }
    if (score >= 70) {
      newBadges.push({ name: 'Point Master', icon: '⚡', description: 'Scored 70+ points' });
    }
    
    setBadges(newBadges);
  };

  const resetGame = () => {
    setGameState('welcome');
    setCurrentRound(0);
    setScore(0);
    setPlayerChoices([]);
    setBadges([]);
    setQuizAnswered(false);
    setShowFeedback(false);
    setLastChoice(null);
    setPurchaseIntention(null);
  };

  const [emailStatus, setEmailStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendDataToEmail = async () => {
    setIsSubmitting(true);
    setEmailStatus('sending');

    const data = {
      playerChoices,
      totalScore: score,
      badges: badges.map(b => b.name).join(', '),
      purchaseIntention,
      userName,
      userEmail,
      quizAnswer,
      quizAnswered,
      completedAt: new Date().toISOString(),
      evibeChoices: playerChoices.filter(c => c.choice.includes('E-VIBE')).length,
      totalCost: playerChoices.reduce((sum, c) => sum + parseFloat(c.cost), 0).toFixed(2),
      totalEmissions: playerChoices.reduce((sum, c) => sum + c.emissions, 0)
    };

    try {
      // Using Web3Forms - a free service for form submissions
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'adcf6733-296a-4336-b8cf-558ad7f72ad9', // You'll need to replace this with your own key
          subject: 'E-VIBE Game Data Submission',
          from_name: 'E-VIBE Game',
          to_email: 'allaboutdiksha@gmail.com',
          message: `
=== E-VIBE GAME DATA ===

Name: ${data.userName || 'N/A'}
Email: ${data.userEmail || 'N/A'}
Player Score: ${data.totalScore}
Purchase Intention: ${data.purchaseIntention}
Quiz Answer: ${data.quizAnswer || 'N/A'} (answered: ${data.quizAnswered ? 'yes' : 'no'})
E-VIBE Choices: ${data.evibeChoices}/5
Total Cost Spent: ₹${data.totalCost}
Total CO₂ Emissions: ${data.totalEmissions}g
Badges Earned: ${data.badges || 'None'}
Completed At: ${data.completedAt}

--- Round Details ---
${playerChoices.map((choice, idx) => `
Round ${idx + 1}:
  Scenario: ${choice.scenario}
  Choice: ${choice.choice}
  Cost: ₹${choice.cost}
  Emissions: ${choice.emissions}g CO₂
  Points: ${choice.points}
`).join('\n')}
          `.trim(),
          game_data: JSON.stringify(data, null, 2)
        })
      });

      if (response.ok) {
        setEmailStatus('success');
      } else {
        setEmailStatus('error');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      setEmailStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadData = () => {
    const data = {
      playerChoices,
      totalScore: score,
      badges,
      purchaseIntention,
      userName,
      userEmail,
      quizAnswer,
      completedAt: new Date().toISOString(),
      evibeChoices: playerChoices.filter(c => c.choice.includes('E-VIBE')).length,
      totalCost: playerChoices.reduce((sum, c) => sum + parseFloat(c.cost), 0).toFixed(2),
      totalEmissions: playerChoices.reduce((sum, c) => sum + c.emissions, 0)
    };
    
    // Create CSV format for easier Excel import
    const csvHeader = 'Round,Scenario,Choice,Cost,Emissions,Points,Timestamp\n';
    const csvRows = playerChoices.map((choice, idx) => 
      `${idx + 1},"${choice.scenario}","${choice.choice}",${choice.cost},${choice.emissions},${choice.points},"${choice.timestamp}"`
    ).join('\n');
    
    const csvSummary = `\n\nSummary\nName,${data.userName || ''}\nEmail,${data.userEmail || ''}\nTotal Score,${data.totalScore}\nPurchase Intention,${data.purchaseIntention}\nQuiz Answer,${data.quizAnswer || ''}\nE-VIBE Choices,${data.evibeChoices}/5\nTotal Cost,${data.totalCost}\nTotal Emissions,${data.totalEmissions}g\nBadges,"${badges.map(b => b.name).join(', ')}"\nCompleted At,${data.completedAt}`;
    
    const csvContent = csvHeader + csvRows + csvSummary;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evibe-game-data-${Date.now()}.csv`;
    a.click();
  };

  // Welcome Screen
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-2xl w-full relative">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-green-100">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sun className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-center mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
              E-VIBE
            </h1>
            <p className="text-xl md:text-2xl text-center text-emerald-700 mb-6 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
              Charge & Go Challenge
            </p>
            
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 mb-8 border-2 border-emerald-200">
              <p className="text-lg text-center text-emerald-900 font-semibold mb-2">
                ☀️ Powered by Sun. Driven by You. 🚴
              </p>
              <p className="text-center text-gray-700 leading-relaxed">
                Make smart daily travel choices and see how your decisions affect cost, health, and the environment. Can you become a Solar Hero?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Save Planet</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Save Money</p>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-xl border border-rose-200">
                <Heart className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Stay Healthy</p>
              </div>
            </div>

            <button
              onClick={() => setGameState('playing')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl font-bold py-4 px-8 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Game 🚀
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  // Quiz Screen
  if (gameState === 'collectInfo') {
    const canContinue = userName.trim().length > 1 && isValidEmail(userEmail);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-purple-100">
            <h2 className="text-2xl font-bold text-center mb-4">Quick Info</h2>
            <p className="text-center text-gray-600 mb-6">Please provide your name and email before the bonus quiz.</p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-3"
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-3"
                  placeholder="you@example.com"
                  type="email"
                  required
                />
                {!isValidEmail(userEmail) && userEmail.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">Please enter a valid email address.</p>
                )}
              </label>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    if (!canContinue) return;
                    // start quiz and also share the collected info with researcher
                    setGameState('quiz');
                    setTimeout(() => sendDataToEmail(), 500);
                  }}
                  disabled={!canContinue || isSubmitting}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-white transition-all duration-300 ${
                    canContinue ? 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Start Quiz ➜
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-purple-100">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-4 text-purple-900">Bonus Quiz! 🧠</h2>
            <p className="text-center text-gray-600 mb-8">Answer correctly for +10 bonus points</p>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 border-2 border-purple-200">
              <p className="text-lg font-semibold text-purple-900 text-center">
                {quizQuestion.question}
              </p>
            </div>

            <div className="space-y-3">
              {quizQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleQuizAnswer(option.id)}
                  disabled={quizAnswered}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-300 ${
                    quizAnswered
                      ? option.correct
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : 'bg-gray-100 border border-gray-300 text-gray-500'
                      : 'bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800'
                  }`}
                >
                  <span className="font-bold mr-2">{option.id.toUpperCase()}.</span>
                  {option.text}
                  {quizAnswered && option.correct && ' ✓'}
                </button>
              ))}
            </div>

            {quizAnswered && (
              <div className="mt-6 text-center">
                <p className="text-green-600 font-bold text-lg animate-pulse">
                  {quizQuestion.options.find(o => o.correct) ? 'Correct! +10 points 🎉' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing' && !showFeedback) {
    const scenario = scenarios[currentRound];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 mb-6 border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Round {currentRound + 1} of 5</p>
                <div className="flex gap-1 mt-1">
                  {scenarios.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-12 rounded-full ${
                        idx < currentRound ? 'bg-emerald-500' :
                        idx === currentRound ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Score</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {score}
                </p>
              </div>
            </div>
          </div>

          {/* Scenario */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {scenario.text}
              </h2>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-900 font-semibold">
                📍 Distance: {scenario.distance} km
              </p>
            </div>
          </div>

          {/* Transport Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Choose your transport:</h3>
            {transportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="w-full bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:scale-102 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl bg-gradient-to-br ${option.bgGradient} w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{option.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">
                        💰 Cost: {option.costPerKm > 0 ? `₹${(option.costPerKm * scenario.distance).toFixed(2)}` : 'FREE'}
                      </p>
                      <p className="text-gray-600">
                        🌍 Emissions: {option.emissions > 0 ? `${option.emissions * scenario.distance}g CO₂` : '0g CO₂'}
                      </p>
                      <p className="text-gray-600">
                        ⚡ Points: +{option.points}
                      </p>
                      <p className="text-gray-600">
                        💚 Health: {option.health.split(' - ')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Feedback Screen
  if (showFeedback && lastChoice) {
    const allOptions = transportOptions.map(opt => ({
      ...opt,
      cost: (opt.costPerKm * scenarios[currentRound].distance).toFixed(2),
      totalEmissions: opt.emissions * scenarios[currentRound].distance
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-orange-200">
            <div className="text-center mb-8">
              <div className="inline-block">
                <div className={`w-20 h-20 bg-gradient-to-br ${lastChoice.option.bgGradient} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-4xl">{lastChoice.option.icon}</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                You chose: {lastChoice.option.name}
              </h2>
              <p className="text-xl text-emerald-600 font-bold">
                +{lastChoice.points} points! 🎉
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Impact Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <th className="p-3 text-left text-sm font-bold text-gray-700 rounded-tl-xl">Transport</th>
                    <th className="p-3 text-center text-sm font-bold text-gray-700">Cost</th>
                    <th className="p-3 text-center text-sm font-bold text-gray-700">Emissions</th>
                    <th className="p-3 text-center text-sm font-bold text-gray-700">Energy</th>
                    <th className="p-3 text-center text-sm font-bold text-gray-700 rounded-tr-xl">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {allOptions.map((opt, idx) => (
                    <tr
                      key={opt.id}
                      className={`${
                        opt.id === lastChoice.option.id
                          ? 'bg-emerald-50 border-2 border-emerald-400'
                          : idx % 2 === 0
                          ? 'bg-gray-50'
                          : 'bg-white'
                      }`}
                    >
                      <td className="p-3 font-semibold text-gray-800">
                        {opt.icon} {opt.name}
                        {opt.id === lastChoice.option.id && ' ✓'}
                      </td>
                      <td className="p-3 text-center text-gray-700">
                        {opt.cost > 0 ? `₹${opt.cost}` : <span className="text-green-600 font-bold">FREE</span>}
                      </td>
                      <td className="p-3 text-center text-gray-700">
                        {opt.totalEmissions > 0 ? `${opt.totalEmissions}g` : <span className="text-green-600 font-bold">0g</span>}
                      </td>
                      <td className="p-3 text-center text-gray-700">
                        {opt.energy.includes('Renewable') ? (
                          <span className="text-green-600 font-bold">☀️ {opt.energy}</span>
                        ) : (
                          <span className="text-orange-600">⛽ {opt.energy}</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-sm text-gray-700">{opt.health}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {lastChoice.option.id === 'evibe' && (
              <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300">
                <p className="text-center text-green-800 font-bold text-lg">
                  🌟 Amazing choice! You saved money, reduced emissions, and stayed healthy! 🌟
                </p>
              </div>
            )}

            <button
              onClick={nextRound}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xl font-bold py-4 px-8 rounded-2xl hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {currentRound < scenarios.length - 1 ? 'Next Round →' : 'See Results →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const evibeChoices = playerChoices.filter(c => c.choice.includes('E-VIBE')).length;
    const totalCost = playerChoices.reduce((sum, c) => sum + parseFloat(c.cost), 0);
    const totalEmissions = playerChoices.reduce((sum, c) => sum + c.emissions, 0);
    const averageScore = 50; // Simulated average

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200">
            {/* Final Score */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Game Complete! 🎉
              </h2>
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 shadow-xl">
                <p className="text-white text-lg mb-2">Your Final Score</p>
                <p className="text-white text-6xl font-bold">{score}</p>
              </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">🏆 Badges Earned</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-6 border-2 border-yellow-400 shadow-lg text-center"
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="font-bold text-gray-800">{badge.name}</p>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 text-center">
                <p className="text-green-800 font-semibold mb-2">E-VIBE Choices</p>
                <p className="text-4xl font-bold text-green-700">{evibeChoices}/5</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 border-2 border-blue-300 text-center">
                <p className="text-blue-800 font-semibold mb-2">Total Cost</p>
                <p className="text-4xl font-bold text-blue-700">₹{totalCost.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 border-2 border-orange-300 text-center">
                <p className="text-orange-800 font-semibold mb-2">CO₂ Emissions</p>
                <p className="text-4xl font-bold text-orange-700">{totalEmissions}g</p>
              </div>
            </div>

            {/* Score Comparison */}
            <div className="bg-gray-100 rounded-2xl p-6 mb-8 border border-gray-300">
              <h4 className="font-bold text-gray-800 mb-4 text-center">📊 Score Comparison</h4>
              <div className="flex items-end justify-center gap-8 h-40">
                <div className="text-center">
                  <div
                    className="bg-gradient-to-t from-gray-400 to-gray-500 rounded-t-xl w-24 flex items-end justify-center pb-2"
                    style={{ height: `${(averageScore / Math.max(score, averageScore)) * 100}%` }}
                  >
                    <span className="text-white font-bold">{averageScore}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-semibold">Average Player</p>
                </div>
                <div className="text-center">
                  <div
                    className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-xl w-24 flex items-end justify-center pb-2"
                    style={{ height: `${(score / Math.max(score, averageScore)) * 100}%` }}
                  >
                    <span className="text-white font-bold">{score}</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-2 font-bold">You! 🌟</p>
                </div>
              </div>
            </div>

            {/* Purchase Intention */}
            {!purchaseIntention ? (
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border-2 border-emerald-300 mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Final Question 🤔
                </h4>
                <p className="text-gray-700 mb-4 text-center">
                  After playing this game, would you consider buying or using a solar electric bicycle like E-VIBE?
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {['Yes', 'Maybe', 'No'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setPurchaseIntention(option);
                        setTimeout(() => sendDataToEmail(), 500);
                      }}
                      disabled={isSubmitting}
                      className={`py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg ${
                        option === 'Yes'
                          ? 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white disabled:from-green-400 disabled:to-green-600'
                          : option === 'Maybe'
                          ? 'bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white disabled:from-yellow-400 disabled:to-amber-600'
                          : 'bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white disabled:from-gray-400 disabled:to-gray-600'
                      }`}
                    >
                      <span className="block text-2xl mb-1">
                        {option === 'Yes' ? '✅' : option === 'Maybe' ? '🤔' : '❌'}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300">
                  <p className="text-center text-green-800 font-bold text-lg">
                    Thank you for your feedback: "{purchaseIntention}" ✓
                  </p>
                </div>
                
                {/* Email Status */}
                {emailStatus === 'sending' && (
                  <div className="bg-blue-100 rounded-2xl p-6 border-2 border-blue-300 text-center">
                    <div className="animate-pulse">
                      <p className="text-blue-800 font-bold">📧 Sending your data...</p>
                    </div>
                  </div>
                )}
                
                {emailStatus === 'success' && (
                  <div className="bg-green-100 rounded-2xl p-6 border-2 border-green-400">
                    <p className="text-center text-green-800 font-bold text-lg">
                      ✅ Data successfully sent to researcher!
                    </p>
                    <p className="text-center text-green-700 text-sm mt-2">
                      Your responses have been recorded for academic research.
                    </p>
                  </div>
                )}
                
                {emailStatus === 'error' && (
                  <div className="bg-orange-100 rounded-2xl p-6 border-2 border-orange-400">
                    <p className="text-center text-orange-800 font-bold text-lg">
                      ⚠️ Auto-send failed
                    </p>
                    <p className="text-center text-orange-700 text-sm mt-2">
                      Please use "Download Data" button below to save your responses.
                    </p>
                    <button
                      onClick={sendDataToEmail}
                      disabled={isSubmitting}
                      className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl transition-all"
                    >
                      Retry Sending
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg font-bold py-4 px-8 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
              >
                🔄 Play Again
              </button>
              <button
                onClick={downloadData}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-lg font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg"
              >
                📥 Download CSV (Excel)
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>This game is part of an academic sustainability research project.</p>
              <p className="mt-1">Your data helps us understand consumer behavior change through gamification.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Evibe;
