import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>',
        // prefix: '<rootDir>/src/',
    }),


    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "./",
    // rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    // "moduleFileExtensions": [
    //     "js",
    //     "json",
    //     "ts"
    // ],
    // "rootDir": "./",
    // // "rootDir": "src",
    // "testRegex": ".*\\.spec\\.ts$",
    // "transform": {
    //     "^.+\\.(t|j)s$": "ts-jest"
    // },
    // "collectCoverageFrom": [
    //     "**/*.(t|j)s"
    // ],
    // "coverageDirectory": "../coverage",
    // "testEnvironment": "node"
};
