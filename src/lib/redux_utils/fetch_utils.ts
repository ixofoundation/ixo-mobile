import 'whatwg-fetch';
import Immutable from 'immutable';
import { checkServerError } from './actions';

interface Dictionary<T> {
	[key: string]: T;
}

/** Utility method for sending a GET request to the specified URL */
export function fetchGetJSON<T>(url: string, extraHeaders?: Dictionary<string>): Promise<T> {
	return fetch(url, {
			method     : 'GET',
			headers    : getJSONRequestHeaders(extraHeaders),
			credentials: 'same-origin'
		})
		.then(res => res.json())
		.then(checkServerError);
}

/** Utility method for sending a PUT request to the specified URL */
export function sendPutJSON<T>(url: string, body: Dictionary<any>, extraHeaders?: Dictionary<string>): Promise<T> {
	return fetch(url, {
			method     : 'PUT',
			body       : JSON.stringify(body),
			headers    : getJSONRequestHeaders(extraHeaders),
			credentials: 'same-origin'
		})
		.then(res => res.json())
		.then(checkServerError);
}

/** Utility method for sending a DELETE request to the specified URL */
export function sendDeleteRequest<T>(url: string, extraHeaders?: Dictionary<string>): Promise<T> {
	return fetch(url, {
			method     : 'DELETE',
			headers    : getJSONRequestHeaders(extraHeaders),
			credentials: 'same-origin'
		})
		.then(res => res.json())
		.then(checkServerError);
}

/** Utility method for sending a POST request to the specified URL */
export function sendPostJSON<T>(url: string, body: Dictionary<any>, extraHeaders?: Dictionary<string>): Promise<T> {
	return fetch(url, {
			method     : 'POST',
			body       : JSON.stringify(body),
			headers    : getJSONRequestHeaders(extraHeaders),
			credentials: 'same-origin'
		})
		.then(res => res.json())
		.then(checkServerError);
}

/** Merge default JSON headers with any extra headers passed to it */
function getJSONRequestHeaders(extraHeaders?: Dictionary<string>): Dictionary<string> {
	// Default headers used for a JSON request
	let requestHeaders: Dictionary<string> = {'Accept': 'application/json', 'Content-Type': 'application/json'};
	if (extraHeaders) {
		// Merge request headers with extra headers if any (extra headers have higher precedence)
		requestHeaders = Immutable.Map(extraHeaders)
							.merge(Immutable.Map(requestHeaders))
							.toJS();
	}
	return requestHeaders;
}
