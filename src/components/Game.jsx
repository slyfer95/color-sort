import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
];
const NUM_ROWS = 4;
const MIN_COLS = 6;
const MAX_COLS = 8;

function Game() {
  const [board, setBoard] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [numCols, setNumCols] = useState(MIN_COLS);

  const initializeBoard = () => {
    // Randomly decide number of columns between MIN_COLS and MAX_COLS
    const randomCols =
      Math.floor(Math.random() * (MAX_COLS - MIN_COLS + 1)) + MIN_COLS;
    setNumCols(randomCols);

    // Calculate number of filled columns (total - 2 empty columns)
    const filledCols = randomCols - 2;

    // Select random colors for the filled columns
    const selectedColors = COLORS.slice(0, filledCols);

    const newBoard = Array(randomCols)
      .fill()
      .map(() => []);
    const colorBlocks = selectedColors.flatMap((color) =>
      Array(NUM_ROWS).fill(color)
    );

    // Shuffle the blocks
    for (let i = colorBlocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorBlocks[i], colorBlocks[j]] = [colorBlocks[j], colorBlocks[i]];
    }

    // Fill the first 'filledCols' columns with colored blocks
    for (let i = 0; i < filledCols; i++) {
      newBoard[i] = colorBlocks.slice(i * NUM_ROWS, (i + 1) * NUM_ROWS);
    }

    setBoard(newBoard);
    setIsWon(false);
    setMoves(0);
  };
  const handleBlockClick = (colIndex) => {
    if (isWon) return;

    if (selectedBlock === null) {
      if (board[colIndex].length > 0) {
        setSelectedBlock(colIndex);
      }
    } else {
      if (colIndex !== selectedBlock) {
        const sourceCol = board[selectedBlock];
        const targetCol = board[colIndex];

        if (sourceCol.length > 0) {
          const topColor = sourceCol[sourceCol.length - 1];

          // Count how many blocks of the same color are at the top of source column
          let sameColorCount = 0;
          for (let i = sourceCol.length - 1; i >= 0; i--) {
            if (sourceCol[i] === topColor) {
              sameColorCount++;
            } else {
              break;
            }
          }

          // Check if target column can accept these blocks
          const availableSpace = NUM_ROWS - targetCol.length;
          const blocksToMove = Math.min(sameColorCount, availableSpace);

          if (
            blocksToMove > 0 &&
            (targetCol.length === 0 ||
              targetCol[targetCol.length - 1] === topColor)
          ) {
            const newBoard = [...board];
            // Remove blocks from source
            const movedBlocks = newBoard[selectedBlock].splice(
              sourceCol.length - blocksToMove,
              blocksToMove
            );
            // Add blocks to target
            newBoard[colIndex].push(...movedBlocks);

            setBoard(newBoard);
            setMoves(moves + 1);

            if (checkWin()) {
              setIsWon(true);
            }
          }
        }
      }
      setSelectedBlock(null);
    }
  };
  const checkWin = () => {
    for (let col of board) {
      if (col.length > 0) {
        const firstColor = col[0];
        if (
          !col.every((block) => block === firstColor) ||
          col.length !== NUM_ROWS
        ) {
          return false;
        }
      }
    }
    // Check if we have the correct number of complete columns
    const completeCols = board.filter((col) => col.length === NUM_ROWS).length;
    return completeCols === numCols - 2; // All columns except the two empty ones
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const getBlockColor = (color) => {
    const colorMap = {
      red: "from-red-400 to-red-500",
      blue: "from-blue-400 to-blue-500",
      green: "from-green-400 to-green-500",
      yellow: "from-yellow-400 to-yellow-500",
      purple: "from-purple-400 to-purple-500",
      orange: "from-orange-400 to-orange-500",
      pink: "from-pink-400 to-pink-500",
      cyan: "from-cyan-400 to-cyan-500",
    };
    return colorMap[color] || "from-gray-400 to-gray-500";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl h-screen p-2">
      {/* Game Header */}
      <div className="w-full mb-2 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="text-lg sm:text-2xl font-bold">
          <span className={`${isWon ? "text-green-500" : ""}`}>
            Color Sort Puzzle
          </span>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <div className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 text-white dark:text-gray-100 rounded-lg text-sm sm:text-base">
            Moves: {moves}
          </div>
          <button
            onClick={initializeBoard}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg 
                     transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative flex-1 w-full flex items-center">
        <div className="flex gap-1 sm:gap-3 overflow-x-auto pb-2 w-screen sm:w-auto px-2">
          {board.map((column, colIndex) => (
            <motion.div
              key={colIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className={`flex-shrink-0 w-12 sm:w-24 h-44 sm:h-72 rounded-xl flex flex-col-reverse relative
                         ${
                           selectedBlock === colIndex
                             ? "ring-4 ring-indigo-500"
                             : ""
                         }
                         bg-gradient-to-b from-gray-100 to-gray-200 
                         dark:from-gray-800 dark:to-gray-900
                         shadow-lg`}
              onClick={() => handleBlockClick(colIndex)}
            >
              {/* Column indicator */}
              <div className="absolute -top-4 sm:-top-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                <span className="font-bold">{colIndex + 1}</span>
              </div>

              {/* Blocks */}
              <div className="flex flex-col-reverse p-1 sm:p-2 gap-1 sm:gap-2">
                {column.map((color, blockIndex) => (
                  <motion.div
                    key={blockIndex}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`w-full h-10 sm:h-16 rounded-lg shadow-md transition-transform 
                              hover:scale-105 cursor-pointer
                              ${
                                blockIndex === column.length - 1
                                  ? "hover:brightness-110"
                                  : ""
                              }
                              bg-gradient-to-r ${getBlockColor(color)}`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Win Message */}
        <AnimatePresence>
          {isWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                         bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-8 shadow-2xl text-center"
            >
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🎉</div>
              <h2 className="text-lg sm:text-2xl font-bold text-green-500 mb-2 sm:mb-4">
                Congratulations!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2 sm:mb-4">
                You solved the puzzle in {moves} moves!
              </p>
              <button
                onClick={initializeBoard}
                className="px-3 py-1.5 sm:px-6 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg
                         transition-colors duration-200 text-sm sm:text-base"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Game;
