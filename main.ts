// deno-fmt-ignore
const consonant1 = ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "W", "X", "Z"];
// deno-fmt-ignore
const consonant2 = ["CH", "SH", "PH", "GH", "TH", "WH", "CK", "BB", "CC", "DD", "FF", "GG", "KK", "LL", "MM", "NN", "PP", "RR", "SS", "TT", "ZZ", "KN", "DG"];
// deno-fmt-ignore
const vowelDummy = "#";
const vowel1 = ["A", "I", "U", "E", "O", "Y", vowelDummy];
// deno-fmt-ignore
const vowel2 = ["AR", "IR", "YR", "ER", "OR", "AU", "UA", "UE", "EA", "EE", "AI", "UU", "UI", "EI", "OI", "IA", "IU", "IE", "IO", "OU", "OO", "OY", "OW", "EW"];
// deno-fmt-ignore
const vowel3 = ["EER", "IEW", "EOU", "ARE", "OUR", "EAR"];

type Chunk = {
  type: "consonant" | "vowel";
  letter: string;
};

type ChunkPair = [{
  type: "consonant";
  letter: string;
}, {
  type: "vowel";
  letter: string;
}];

const parseStr = (str: string) => {
  // console.log("parseStr");
  const chunkPairs: ChunkPair[] = [];
  let rest = str;
  while(rest){
    const parsed = parseChunk(rest.slice(0, 4).padEnd(4, vowelDummy));
    chunkPairs.push(parsed.chunkPair);
    rest = parsed.rest.replaceAll(vowelDummy, "") + rest.slice(4);
    // console.log(`parsed: ${parsed.chunkPair[0].letter} ${parsed.chunkPair[1].letter}`);
    // console.log(`rest: ${rest}`);
  }
  return chunkPairs;
}

const parseChunk = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  // const headChunk = parsePattern(headSlice);
  // const headPattern = unfoldPattern(headChunk).map(chunk => chunk.type === "vowel" ? "V" : "C").join("");

  const headPattern = parsePattern(headSlice);

  switch (headPattern) {
    case "VVVV":
    case "VVVC":
    case "VVCV":
    case "VVCC":
      return sliceCaseA(headSlice);
    case "VCVV":
    case "VCVC":
    case "VCCV":
    case "VCCC":
      return sliceCaseB(headSlice);
    case "CVVV":
      return sliceCaseC(headSlice);
    case "CVVC":
      return sliceCaseD(headSlice);
    case "CVCV":
      return sliceCaseE(headSlice);
    case "CVCC":
      return sliceCaseF(headSlice);
    case "CCVV":
    case "CCVC":
      return sliceCaseG(headSlice);
    case "CCCV":
    case "CCCC":
      return sliceCaseH(headSlice);

    default:
      throw new Error("予期せぬパターン");
  }
};

const sliceCaseA = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //一文字母音字 + 1文字母音字
  return {
    chunkPair: [{
      type: "consonant",
      letter: headSlice.slice(0, 1),
    }, {
      type: "vowel",
      letter: "*",
    }],
    rest: headSlice.slice(1, 4),
  };
};

const sliceCaseB = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //1文字子音字
  return {
    chunkPair: [{
      type: "consonant",
      letter: headSlice.slice(0, 1),
    }, {
      type: "vowel",
      letter: "*",
    }],
    rest: headSlice.slice(1, 4),
  };
};

const sliceCaseC = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //1文字子音字 + 3文字母音字
  //1文字子音字 + 2文字母音字
  //1文字子音字 + 1文字母音字
  const consonantChunk = {
    type: "consonant" as const,
    letter: headSlice.slice(0, 1),
  };

  if (vowel3.includes(headSlice.slice(1, 4))) {
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 4),
      }],
      rest: "",
    };
  }
  if (vowel2.includes(headSlice.slice(1, 3))) {
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 3),
      }],
      rest: headSlice.slice(3, 4),
    };
  }

  return {
    chunkPair: [consonantChunk, {
      type: "vowel",
      letter: headSlice.slice(1, 2),
    }],
    rest: headSlice.slice(2, 4),
  };
};

const sliceCaseD = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //1文字子音字 + 3文字母音字
  //1文字子音字 + 2文字母音字
  //1文字子音字 + 1文字母音字

  const consonantChunk = {
    type: "consonant" as const,
    letter: headSlice.slice(0, 1),
  };

  if (vowel3.includes(headSlice.slice(1, 4))) {
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 4),
      }],
      rest: "",
    };
  }
  if (vowel2.includes(headSlice.slice(1, 3))) {
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 3),
      }],
      rest: headSlice.slice(3, 4),
    };
  }

  return {
    chunkPair: [consonantChunk, {
      type: "vowel",
      letter: headSlice.slice(1, 2),
    }],
    rest: headSlice.slice(2, 4),
  };
};

const caseEExceptionRegex = new RegExp("^(.a.e|.i.e)$");

const sliceCaseE = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //1文字子音字 + 3文字母音字
  //1文字子音字 + 2文字母音字 //論文 表4のミス？
  //?a?e, ?i?eの例外
  //1文字子音字 + 1文字母音字

  const consonantChunk = {
    type: "consonant" as const,
    letter: headSlice.slice(0, 1),
  };

  if (vowel3.includes(headSlice.slice(1, 4))) {
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 4),
      }],
      rest: "",
    };
  }
  // if (vowel2.includes(headSlice.slice(1, 3))) {
  //   return {
  //     chunkPair: [consonantChunk, {
  //       type: "vowel",
  //       letter: headSlice.slice(1, 3),
  //     }],
  //     rest: headSlice.slice(3, 4),
  //   };
  // }
  if (caseEExceptionRegex.test(headSlice)) {
    //TODO 例外!
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 3),
      }],
      rest: headSlice.slice(3, 4),
    };
  }

  return {
    chunkPair: [consonantChunk, {
      type: "vowel",
      letter: headSlice.slice(1, 2),
    }],
    rest: headSlice.slice(2, 4),
  };
};

const sliceCaseF = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //1文字子音字 + 2文字母音字
  //1文字子音字 + 1文字母音字
  const consonantChunk = {
    type: "consonant" as const,
    letter: headSlice.slice(0, 1),
  };

  if (vowel2.includes(headSlice.slice(1, 3))) {
    return {
      chunkPair: [consonantChunk, {
        type: "vowel",
        letter: headSlice.slice(1, 3),
      }],
      rest: headSlice.slice(3, 4),
    };
  }

  return {
    chunkPair: [consonantChunk, {
      type: "vowel",
      letter: headSlice.slice(1, 2),
    }],
    rest: headSlice.slice(2, 4),
  };
};

const sliceCaseG = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //2文字子音字 + 2文字母音字
  //2文字子音字 + 1文字母音字
  //1文字子音字
  if (consonant2.includes(headSlice.slice(0, 2))) {
    if (vowel2.includes(headSlice.slice(2, 4))) {
      return {
        chunkPair: [{
          type: "consonant",
          letter: headSlice.slice(0, 2),
        }, {
          type: "vowel",
          letter: headSlice.slice(2, 4),
        }],
        rest: "",
      };
    }
    if (vowel1.includes(headSlice.slice(2, 3))) {
      return {
        chunkPair: [{
          type: "consonant",
          letter: headSlice.slice(0, 2),
        }, {
          type: "vowel",
          letter: headSlice.slice(2, 3),
        }],
        rest: headSlice.slice(3, 4),
      };
    }
  }

  return {
    chunkPair: [{
      type: "consonant",
      letter: headSlice.slice(0, 1),
    }, {
      type: "vowel",
      letter: "*",
    }],
    rest: headSlice.slice(1, 4),
  };
};

const sliceCaseH = (headSlice: string): {
  chunkPair: ChunkPair;
  rest: string;
} => {
  //2文字子音字
  //1文字子音字
  if (consonant2.includes(headSlice.slice(0, 1))) {
    return {
      chunkPair: [{
        type: "consonant",
        letter: headSlice.slice(0, 2),
      }, {
        type: "vowel",
        letter: "*",
      }],
      rest: headSlice.slice(2, 4),
    };
  }

  return {
    chunkPair: [{
      type: "consonant",
      letter: headSlice.slice(0, 1),
    }, {
      type: "vowel",
      letter: "*",
    }],
    rest: headSlice.slice(1, 4),
  };
};

const constructRegExp = (
  list: string[],
  wrapper: (content: string) => string = ((content) => content),
) => {
  const pattern = wrapper(list.join("|"));
  return new RegExp(pattern);
};

const consonant: Array<string> = [...consonant2, ...consonant1];
const consonantRegex = constructRegExp(consonant);
const vowel = [...vowel3, ...vowel2, ...vowel1];
const vowelRegex = constructRegExp(vowel);
const consonantVowelRegex = constructRegExp([
  ...vowel3,
  ...consonant2,
  ...vowel2,
  ...consonant1,
  ...vowel1,
], (content) => `(${content})`);

const parsePattern = (headSlice: string): string => {
  return Array.from(headSlice).map((char) => vowel1.includes(char) ? "V" : "C")
    .join("");
};

//
// const parsePattern = (headSlice: string): Chunk[] => {
//   return headSlice.split(consonantVowelRegex).filter((
//     letter,
//   ) => !!letter).map(
//     (letter) => {
//       if (consonant.includes(letter)) {
//         return {
//           type: "consonant",
//           letter: letter,
//         };
//       } else if (vowel.includes(letter)) {
//         return {
//           type: "vowel",
//           letter: letter,
//         };
//       } else {
//         throw new Error("母音でも子音でも無い文字");
//       }
//     },
//   );
// };
//
// const unfoldPattern = (chunks: Chunk[]): Chunk[] => {
//   return chunks.reduce<Chunk[]>((acc, cur) => {
//     return [
//       ...acc,
//       ...Array.from(cur.letter).map((char) => {
//         return {
//           type: cur.type,
//           letter: char,
//         };
//       }),
//     ];
//   }, []);
// }

const testParseChunk = (head: string) => {
  console.log(parseChunk(head));
}


const testParsePattern = (head: string) => {
  console.log(parsePattern(head));
}


testParseChunk("CARN"); //car ne y
testParseChunk("CARO"); //ca ro le
// testParsePattern("CARO");
testParseChunk("SPAR"); //s p ar k
testParseChunk("CHIL"); //ch i l d
testParseChunk("MAKE"); //m a k e
testParseChunk("CHAR"); //ch ar

console.log(parseStr("CARNEY"));
console.log(parseStr("CAROLE"));
console.log(parseStr("SPARK"));
console.log(parseStr("CHILD"));
console.log(parseStr("MAKE"));
console.log(parseStr("PARKER"));
console.log(parseStr("CHARLIE"));