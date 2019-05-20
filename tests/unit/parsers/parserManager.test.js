/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import ParserManager, { getParserManager } from '../../../src/parsers/parserManager.js';

it('ParserManager should be defined', () => {
	expect(ParserManager).toBeDefined()
})

it('ParserManager should be able to store a set of parsers', () => {
	const parser1 = jest.fn()
	parser1.getMimeTypes = jest.fn()
		.mockReturnValue(['mime/1', 'mime/2'])

	const parser2 = jest.fn()
	parser2.getMimeTypes = jest.fn()
		.mockReturnValue(['mime/3', 'mime/4'])

	const parser3 = jest.fn()
	parser3.getMimeTypes = jest.fn()
		.mockReturnValue(['mime/5', 'mime/6'])

	const parserManager = new ParserManager()
	parserManager.registerParser(parser1)
	parserManager.registerParser(parser2)
	parserManager.registerParser(parser3)

	expect(parserManager.getParserForFileType('mime/5', {option: 1})).toEqual(parser3.mock.instances[0])
	expect(parserManager.getParserForFileType('mime/1', {option: 2})).toEqual(parser1.mock.instances[0])
	expect(parserManager.getParserForFileType('mime/3', {option: 3})).toEqual(parser2.mock.instances[0])
	expect(parserManager.getParserForFileType('mime/6', {option: 4})).toEqual(parser3.mock.instances[1])
	expect(parserManager.getParserForFileType('mime/4', {option: 5})).toEqual(parser2.mock.instances[1])
	expect(parserManager.getParserForFileType('mime/2', {option: 6})).toEqual(parser1.mock.instances[1])

	expect(parser3.mock.calls[0][0]).toEqual({option: 1})
	expect(parser1.mock.calls[0][0]).toEqual({option: 2})
	expect(parser2.mock.calls[0][0]).toEqual({option: 3})
	expect(parser3.mock.calls[1][0]).toEqual({option: 4})
	expect(parser2.mock.calls[1][0]).toEqual({option: 5})
	expect(parser1.mock.calls[1][0]).toEqual({option: 6})

	expect(() => {
		parserManager.getParserForFileType('mime/99', {option: 99})
	}).toThrow(TypeError, 'Unknown file-type.')
})

it('ParserManager should return a list of all supported file types combined', () => {
	const parser1 = jest.fn()
		.mockReturnValue('parser1')
	parser1.getMimeTypes = jest.fn()
		.mockReturnValue(['mime/1', 'mime/2'])

	const parser2 = jest.fn()
		.mockReturnValue('parser2')
	parser2.getMimeTypes = jest.fn()
		.mockReturnValue(['mime/3', 'mime/4'])

	const parser3 = jest.fn()
		.mockReturnValue('parser3')
	parser3.getMimeTypes = jest.fn()
		.mockReturnValue(['mime/5', 'mime/6'])

	const parserManager = new ParserManager()
	parserManager.registerParser(parser1)
	parserManager.registerParser(parser2)
	parserManager.registerParser(parser3)

	expect(parserManager.getAllSupportedFileTypes()).toEqual([
		'mime/1',
		'mime/2',
		'mime/3',
		'mime/4',
		'mime/5',
		'mime/6'
	])
})

it('There should be a default ParserManager', () => {
	const parserManager = getParserManager()

	expect(parserManager.getAllSupportedFileTypes()).toEqual(['text/calendar'])
})
