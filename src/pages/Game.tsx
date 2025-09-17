import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Circle, RotateCcw, Trophy, Heart } from 'lucide-react';

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [draws, setDraws] = useState(0);

  // Check for winner
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
      [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Check if board is full (draw)
  const isDraw = (squares: (string | null)[]) => {
    return squares.every(square => square !== null);
  };

  // Handle click on square
  const handleClick = (i: number) => {
    if (board[i] || gameOver) return;

    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    // Check for winner
    const winner = calculateWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      if (winner === 'X') {
        setXScore(prev => prev + 1);
      } else {
        setOScore(prev => prev + 1);
      }
    } else if (isDraw(newBoard)) {
      setDraws(prev => prev + 1);
      setGameOver(true);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
  };

  // Reset scores
  const resetScores = () => {
    setXScore(0);
    setOScore(0);
    setDraws(0);
    resetGame();
  };

  // Get status message
  const getStatusMessage = () => {
    if (winner) {
      return `بازیکن ${winner === 'X' ? 'X' : 'O'} برنده شد! 🎉`;
    } else if (gameOver) {
      return 'بازی مساوی شد! 🤝';
    } else {
      return `نوبت بازیکن: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  // Render square
  const renderSquare = (i: number) => {
    const value = board[i];
    const isWinningSquare = winner && calculateWinner(board) === value;
    
    return (
      <button
        key={i}
        className={`
          w-20 h-20 md:w-24 md:h-24 
          border-2 border-gray-300 
          bg-white hover:bg-gray-50 
          transition-all duration-200 
          flex items-center justify-center 
          text-3xl md:text-4xl font-bold
          ${isWinningSquare ? 'bg-green-100 border-green-500 shadow-lg' : ''}
          ${value === 'X' ? 'text-blue-600' : 'text-red-600'}
          ${!value && !gameOver ? 'hover:scale-105 hover:shadow-md' : ''}
        `}
        onClick={() => handleClick(i)}
        disabled={!!value || gameOver}
      >
        {value === 'X' ? (
          <X className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
        ) : value === 'O' ? (
          <Circle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
        ) : null}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              بازی دوز 🎮
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              یک بازی کلاسیک و سرگرم‌کننده برای گذراندن وقت در آزمایشگاه
            </p>
          </div>

                     <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
            
            {/* Game Board */}
            <div className="flex flex-col items-center">
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
                {/* Status */}
                <div className="text-center mb-6">
                  <div className={`text-xl font-bold p-3 rounded-xl ${
                    winner ? 'bg-green-100 text-green-800' : 
                    gameOver ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {getStatusMessage()}
                  </div>
                </div>

                                 {/* Board */}
                 <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-6">
                   {Array(9).fill(null).map((_, i) => renderSquare(i))}
                 </div>

                                 {/* Action Buttons */}
                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                   <Button
                     onClick={resetGame}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                   >
                     <RotateCcw className="w-5 h-5 ml-2" />
                     بازی جدید
                   </Button>
                   
                   <Button
                     onClick={resetScores}
                     variant="outline"
                     className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                   >
                     <Trophy className="w-5 h-5 ml-2" />
                     ریست امتیازات
                   </Button>
                 </div>
              </Card>
            </div>

                         {/* Scoreboard */}
             <div className="space-y-4 sm:space-y-6">
              {/* Score Card */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  امتیازات
                </h3>
                
                <div className="space-y-4">
                  {/* Player X Score */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <X className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-gray-800">بازیکن X</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{xScore}</div>
                  </div>

                  {/* Player O Score */}
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <Circle className="w-6 h-6 text-red-600" />
                      <span className="font-semibold text-gray-800">بازیکن O</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{oScore}</div>
                  </div>

                  {/* Draws */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-gray-600" />
                      <span className="font-semibold text-gray-800">مساوی</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-600">{draws}</div>
                  </div>
                </div>
              </Card>

              {/* How to Play */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  نحوه بازی
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>دو بازیکن به نوبت X و O می‌گذارند</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>هدف ایجاد یک خط افقی، عمودی یا مورب است</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>اولین بازیکنی که خط بسازد برنده می‌شود</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>اگر صفحه پر شود و خطی ساخته نشود، بازی مساوی است</span>
                  </div>
                </div>
              </Card>

              {/* Fun Fact */}
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0 shadow-xl rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-center">
                  🧪 نکته علمی
                </h3>
                <p className="text-sm text-purple-100 leading-relaxed">
                  بازی دوز یکی از قدیمی‌ترین بازی‌های استراتژیک جهان است که قدمتی بیش از ۳۰۰۰ سال دارد. 
                  این بازی در مصر باستان، روم و چین باستان بازی می‌شده و امروزه در آزمایشگاه‌ها برای 
                  تقویت مهارت‌های تفکر استراتژیک استفاده می‌شود!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
