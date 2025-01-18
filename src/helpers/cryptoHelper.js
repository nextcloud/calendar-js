/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Generates a random UUID v4.
 *
 * @return {string}
 */
export function randomUUID() {
	if (crypto?.randomUUID) {
		// Only available in secure contexts
		return crypto.randomUUID()
	}

	return insecureUuidV4()
}

/**
 * Generates a random UUID v4 from a weak, non-cryptographic random number generator.
 * Please use randomUUID() instead.
 *
 * Adapted from https://gist.github.com/scwood/3bff42cc005cc20ab7ec98f0d8e1d59d
 * Copyright 2018 Spencer Wood
 *
 * @return {string}
 */
export function insecureUuidV4() {
	const uuid = new Array(36)
	for (let i = 0; i < 36; i++) {
		uuid[i] = Math.floor(Math.random() * 16)
	}
	uuid[14] = 4 // set bits 12-15 of time-high-and-version to 0100
	uuid[19] = uuid[19] &= ~(1 << 2) // set bit 6 of clock-seq-and-reserved to zero
	uuid[19] = uuid[19] |= (1 << 3) // set bit 7 of clock-seq-and-reserved to one
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
	return uuid.map((x) => x.toString(16)).join('')
}
