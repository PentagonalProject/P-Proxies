// Type definitions for ./app/Request.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// createOption.!0

/**
 * 
 */
declare interface 0 {
	
	/**
	 * 
	 */
	headers : {
				
		/**
		 * 
		 */
		"Accept-Encoding" : string;
				
		/**
		 * 
		 */
		"Accept-Language" : string;
				
		/**
		 * 
		 */
		"Cache-Control" : string;
				
		/**
		 * 
		 */
		Pragma : string;
				
		/**
		 * 
		 */
		"Upgrade-Insecure-Requests" : string;
	}
}
// Client.!2
type 2 = (() => void);

/**
 * 
 * @param options 
 * @return  
 */
declare function createOption(options : 0): 0;

/**
 * @param url
 * @param options
 * @param callback
 * @return http.ClientRequest
 */
declare interface Client {
		
	/**
	 * 
	 * @param url 
	 * @param options 
	 * @param callback 
	 * @return  
	 */
	new (url : any, options : /* createOption.!0 */ any, callback : 2): Client;
}

