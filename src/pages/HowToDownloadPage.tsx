import React from 'react';
import { Download, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const HowToDownloadPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Download className="h-10 w-10 text-green-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            How to Download
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Follow this comprehensive guide to download movies safely and efficiently from our platform.
        </p>
      </div>

      {/* Step-by-step Guide */}
      <div className="space-y-8 mb-12">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Find Your Movie</h3>
              <p className="text-gray-300 mb-4">
                Browse through our categories or use the search function to find the movie you want to download.
              </p>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  <strong>Tip:</strong> Use specific keywords like the movie title, year, or actor names for better search results.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Select Movie Quality</h3>
              <p className="text-gray-300 mb-4">
                Click on the movie poster to open the movie page. Choose your preferred quality from the available options.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-green-600 text-white px-3 py-2 rounded text-center text-sm">480p</div>
                <div className="bg-green-600 text-white px-3 py-2 rounded text-center text-sm">720p</div>
                <div className="bg-green-600 text-white px-3 py-2 rounded text-center text-sm">1080p</div>
                <div className="bg-green-600 text-white px-3 py-2 rounded text-center text-sm">4K UHD</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  <strong>Note:</strong> Higher quality files are larger in size. Choose based on your internet speed and storage capacity.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Navigate Through Ad Links</h3>
              <p className="text-gray-300 mb-4">
                After clicking the download button, you'll be redirected through our ad partners. This helps us keep the service free.
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Wait for the countdown timer (usually 5-10 seconds)</span>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-200 text-sm">
                      <strong>Important:</strong> Close any pop-up ads that may appear. Only click on the designated download buttons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Start Download</h3>
              <p className="text-gray-300 mb-4">
                Once you reach the final download page, click the download button to start downloading your movie.
              </p>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-green-200 text-sm">
                      <strong>Success:</strong> Your download should start automatically. If not, right-click the download link and select "Save as".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Safety Tips</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Use a reliable antivirus software</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Enable ad-blocker for better experience</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Don't download suspicious files</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Verify file sizes match our listings</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="h-6 w-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Download Tips</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Use a download manager for faster speeds</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Download during off-peak hours</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Ensure stable internet connection</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Check available storage space</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Why do I see ads before downloading?</h4>
            <p className="text-gray-300">
              Ads help us maintain this free service and cover hosting costs. The revenue from ads allows us to provide high-quality movie downloads at no cost to you.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-2">What if the download link doesn't work?</h4>
            <p className="text-gray-300">
              If a download link is broken, please report it to us. We regularly update our links and remove broken ones. Try alternative quality options if available.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Are the downloads safe?</h4>
            <p className="text-gray-300">
              We scan all files for malware, but we recommend using antivirus software. Only download from our official links and avoid suspicious pop-ups or redirects.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {movie.downloadLinks.map((link, idx) => (
          <div key={idx} className="mb-8">
            <hr className="mb-4 border-gray-400" />
            <div className="text-center">
              <div className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {link.description}
              </div>
              <div className="text-red-600 font-bold mb-4">
                [{link.size}]
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded text-lg transition"
              >
                Download (driveleech)
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToDownloadPage;