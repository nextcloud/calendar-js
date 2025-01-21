/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { insecureUuidV4, randomUUID } from '../../../src/helpers/cryptoHelper.js'

it('randomUUID should return a random UUIDv4', () => {
	expect(typeof randomUUID() === 'string').toEqual(true)
	for (let i = 0; i < 100; i++) {
		expect(randomUUID())
			.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
	}
})

it('randomUUID should use the built-in implementation in secure contexts', () => {
	crypto.randomUUID = () => 'RANDOM UUID 123'
	expect(randomUUID()).toBe('RANDOM UUID 123')
})

it('insecureUuidV4 should return a random UUIDv4', () => {
	expect(typeof insecureUuidV4() === 'string').toEqual(true)
	for (let i = 0; i < 100; i++) {
		expect(insecureUuidV4())
			.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
	}
})
