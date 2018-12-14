#import "RNDeviceInfo.h"
#import <React/RCTLog.h>

@implementation RNDeviceInfo

RCT_EXPORT_MODULE(RNDeviceInfo)

- (NSDictionary *)constantsToExport
{
  
  return @{
           @"bundleId": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"] ?: [NSNull null],
           };
}

@end
