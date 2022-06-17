
//Write a program that prints the numbers from 1 to 87. But for multiples of three print “Three” instead of the number and for the multiples of five print “Five”. For numbers which are multiples of both three and five print “Burger”
function test() : void {
    for(let i=1; i<= 87; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            console.log('Burger');
        }
        else if(i % 3 == 0) {
            console.log('Three');
        }
        else if(i % 5 == 0) {
            console.log('Five');
        } else {
            console.log(`${i} : Pas de three pas de five et pas de burger`);
        }
    }
}
// test();

function fizzBuzz(n: number) {
    for(let i=1; i<=n;i++) {
        if(i%3 != 0 && i%5 != 0) {
            console.log(i);
        } else if(i%3 == 0 && i%5 !=0) {
            console.log('Fizz');
        } else if(i%3 != 0 && i%5 ==0) {
            console.log('Buzz');
        }
        else if(i%3 == 0 && i%5 ==0) {
            console.log('FizzBuzz');
        }
    }
}
// fizzBuzz(65);

function test2(numbers: Array<number>): void {
    const arrayLength : number = numbers.length;
    let fullArray: Array<number> = [];
    for(let i=1;i<arrayLength+2;i++) {
        fullArray.push(i);
    }
    let difference = fullArray.filter(x => numbers.indexOf(x) === -1);
    console.log(difference);
}

// test2([1, 3, 5, 4]);
// test2([6, 3, 4, 5, 2]);
// test2([5, 3, 2, 1, 4]);

function test3(arrayNumbers: Array<number>, k: number): number {
    let count: number = 0;
    for(let i = 0; i< arrayNumbers.length; i++) {
        let tmp: number = 0;
        for(let j = i; j < arrayNumbers.length;j++) {
            console.log(j)
            tmp += arrayNumbers[j];
            // console.log('test : '+arrayNumbers[j]);
            // console.log(tmp);
            // console.log(arrayNumbers[i]);
            if(tmp === k) {
                count++;
            }
            if(tmp > k ) {
                break;
            }
        }
    }
    console.log(`count : ${count}`);
    return count;
}

// test3([1,1,1], 2);
// test3([1,2,3,0,3], 3);
// test3([4, 2, 9, 7, 19], 5);
// test3([-1, 1], 1);


function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    const fusionArray: number[] = [...nums1, ...nums2];
    if (!fusionArray.length) return 0;
    const s = [...fusionArray].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? ((s[mid - 1] + s[mid]) / 2) : s[mid];
}

// findMedianSortedArrays([1,3], [2])
// findMedianSortedArrays([1,2], [3,4])

function isPalindrome(str : string) : boolean {
    let rev: string = "";
    let length: number = str.length;
    let result: boolean;
    while(length--){
        rev += str[length];
    }
    result = str === rev;
    return result;
}

// isPalindrome('kayak');
// isPalindrome('toupie');

function longestPalindrome(s: string) {
    if (s.length < 1) return "";
    let result: string;
    let maxSubStart = 0;
    let maxSubLength = 0;
    for (let i = 0; i < s.length; i++) {
        const lengthCenteredAtChar = expandAroundCenter(s, i, i);
        const lengthCenteredAtSpace = expandAroundCenter(s, i, i + 1);
        const longestSubAtChar = Math.max(lengthCenteredAtChar, lengthCenteredAtSpace)
        if (longestSubAtChar > maxSubLength) {
            maxSubLength = longestSubAtChar;
            maxSubStart = i - Math.floor((maxSubLength - 1) / 2);
        }
    }
    result = s.substring(maxSubStart, maxSubLength);
    return result
}

function expandAroundCenter(s: string | any[], left: number, right: number) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
}

//longestPalindrome('kayak');
// longestPalindrome('babad');

function reverse(x: number): number {
    if (x< Math.pow(2, 31) && x>Math.pow(-2,31)) {
        let reversedNumberArray: number[];
        let resultInversed: number = 0;
        let resultInversedString: string = '';
        reversedNumberArray = x.toString().split("").map(Number);
        reversedNumberArray = reversedNumberArray.reverse();
        reversedNumberArray.forEach(value => {
            if(!isNaN(value)) {
                resultInversedString += value.toString()
            }
        })
        if(Math.sign(x) == -1) {
            resultInversedString = '-'+resultInversedString;
        }
        resultInversed = Number(resultInversedString);
        return resultInversed;
    } return 0;
}
// 321
// reverse(123)
// 21
// reverse(120)
// -321
// reverse(-123)
// 109
// reverse(901000)
// 0
// reverse(1534236469)

function isPrime(n: number){

    if (n === 2) {
        console.log(1)
        return 1;
    }
    else if (n > 1) {
        for (let i = 2; i < n; i++) {
            if (n % i == 0) {
                console.log(i);
                return i;
            }
        }
    }
}

// isPrime(24)
// isPrime(2)
// isPrime(4)

function funWithAnagrams(text: Array<string>) {
    let sortedArray: Array<string> = text;
    let temp1: string = "";
    let temp2: string = "";
    for(let i=0; i<text.length; i++){
        for(let j=text.length-1; j>i; j--){
            temp1 = sortedArray[i].split("").sort().join("")
            temp2 = sortedArray[j].split("").sort().join("")
            if(temp1===temp2){
                sortedArray.splice(j,1)
            }
        }
    }
    return sortedArray.sort();
}
// [aaagmnrs, code]
// funWithAnagrams(["code","aaagmnrs","anagrams","doce"] );

function countBalancingElements(arr: Array<number>) {
    let arrSize = arr.length;
    let arrCopy = arr;
    let countBalancedElements = 0;
    let balanceTest = 0;
    let sumEven= 0;
    let sumOdd = 0;
    for(let i=0;i< arrSize; i++) {
        arrCopy = arr;
        sumOdd = 0;
        sumEven = 0;
        balanceTest = arr[i];
        arrCopy = arr.filter(function(value, index) {
            if(arr[index-1] === balanceTest) {
                return value !== balanceTest
            }
        })
        arrCopy.forEach((value, index) => {
            if(index % 2 == 0) {
                //even
                sumEven += value
            } else {
                sumOdd += value
            }
        })
        if(sumOdd === sumEven) {
            countBalancedElements++
        }
    }
    return countBalancedElements;
}
// 3
// countBalancingElements([3,2,2,2])
// 1
// countBalancingElements([2,1,6,4])
// 2
countBalancingElements([5,5,2,5,8])