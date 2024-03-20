////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

module.exports = (api) => {
	const isTest = api.env('test');
	// You can use isTest to determine what presets and plugins to use.

	console.log('IS TEST', isTest);

	if (isTest) {
		return {
			presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
			plugins: [
				'@babel/plugin-transform-flow-strip-types',
				['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
			],
		};
	}

	return {
		presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
		plugins: ['@realm/babel-plugin', ['@babel/plugin-proposal-decorators', { legacy: true }]],
	};
};

// import type { JestConfigWithTsJest } from 'ts-jest';

// const jestConfig: JestConfigWithTsJest = {
// 	presets: ['module:metro-react-native-babel-preset'],
// 	plugins: ['@babel/plugin-transform-flow-strip-types'],
// };

// export default jestConfig;