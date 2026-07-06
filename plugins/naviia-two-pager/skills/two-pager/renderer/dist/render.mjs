// src/two-pager/render-cli.ts
import { readFileSync as readFileSync2, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// src/two-pager/pdf/CombinedTwoPagerPdfBuilder.tsx
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument as PDFDocument2 } from "pdf-lib";

// src/two-pager/pdf/addPageNumbers.ts
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

// src/two-pager/assets/naviiaLogoBase64.ts
var NAVIIA_LOGO_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAZAAAAGNCAQAAACV/u8CAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAABLAAAASwAc4jpUgAAAAd0SU1FB+oCCg0OFOL3S+AAAB11SURBVHja7d17mJTFge/xb/fM9MwwFxiuAhIUXIkgGI2AJmpEUIyKGI23GGMIukuOGj1uTNYTNzGbdTeJZrPrLcGTaHSjkcVjokfUaFQw3oPKikTBBFDuch3nwty6e/9g6Knqfrvfqnd6YIDfZx6ep7vpem9dVW9VvXUBEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREdkvxYnvzd2XRggzkDGMZAjVlJOggrf4FWmnkAkO41CG0p9KEpRRwUruom1vXgDp5c7hizTQyDaa+Ih1rGY97U4h+3AtI0mTpJ6trOcD/sqmnj7cWuawmAaSpDN/85zSeJyTeYgNtBkh0zxPRU8fsuzTrjdiS5ImVvIIX6G/Q8g6llhhP+Ydvs+InjzY8TxKhxXB06R50CGB9OdmtuWETDOfkj11pWWfdHlArOngeU4KDVnHGwFhF3NqTx3qafw5YIcuCWQY8wNDprlnT19v2cdcbJVWuv7WMjMkZHACSbORS3riQM9hXZ5IHpZA6vivPCHT3La3rrvsI84LKLPs+vuAzxQMmS+BpNnKha67d20hmMxtDIu4jas5P+//7Sj+FZX9ys68//MJ/pmBBcPG8nzen1tDEleGWytWgv+dU7lppIkOoJStBcNO5n9lfZKkmSZaaKaJ5d27erLfW8cLDKaKSvrQJ6vGejJf5da8IVNsYiNJoIQKaqywB/NPnM/28N3Hwr8CjOVZDjLer+HnLGQ77UCMBjbmDRlnLpcb7zfxCItYTT1NtNLCTscmOzlQxelDJRVUU8tIpnE+/Yz/XcHprMobcjjlAJRQzTjmcLzxv0ku51fFOsgvWuXANznBOeQoVhkhV/dcC4IcEGJcyHqrPvF3zmEP5gFSRsiHiteC+i1jsy8w1iPk2dZzj+v25LWU/dRMK4n8wiNkX+4wsvqXqQkP4lZJH2q8fog/exzSGMoyr9exoEcvnBwYHuOPxrsRncUoF/XcTX3mXT/6hAdxSyD9jNd+HUMONl6vYE3xrpIcsNI0Gu8GePXF6KAj87qW6vAALq1YpVYCSXkcTpxBxruVNEe4HHUMp5U22kmSop0O2ml1ClljNUyvsy7r/iPBCKqpoi81xHks0jU21XA8MRpoZicfs9mIUL1Hi/G6goRHyKTRa7CcyvAALgkkbh2CTwIpsUp56yNdjOncThttdJAkyU7a+IDr2OAQ8kTuzlTD2pnNM5H239sdznyGUEaCBO+zqNsJZBi/ZAgtdNDGai7O20a0N5kZZIVHEQtSRvwtd6mD9GwCsUN+FOlilOc8DDqep7nXIWQFQzNFyA6vfGZfkmAofTtfx4rQNTxGGWWdNceYV+Tbc8y7ml8CMXudlxWrDlJilPJSjsWbXUqt8mHUvC23K/2FLqdG2kjMKccO+fuirrMsztiJrivVW69a0nhd4tVYmzLCxl2SlssFLY2cQOyk1d2bf5fPMNk7TO/8qYsr5vjgd19nJpC4VwLpMB5Ml1AVHsBtJEdXU23K68m3GTJZxARSw4WeUSF9gCSQA4NZSY97DfrrkQRi5ktprwRihyzmyMEzONwzxIGQQA4UZgfGEq/aZYdVf3FIWm53kK5vpa3bm4/oIYOMCB0NkLt/2V+YxfxSrwSSsmJh0RJIVynPN5qbd5DiRtHzQ7o62/bnIlbXb1icIpa5vd5ZaDPLIr4JJGWFDeX2oND8lk9Esy9vcaPoUZzCfxV1i/umDj6ijTQQZ7NXI3z+7cVIA7Fe+pjQrqT7NW3bGaVD0vJNIKluFJS6n0Ca2cDoztdlXMyjHm1q++sdZAUzOqNIjLYizNrxIedR2plA2vlwb59eIDsb8EsgZliHZl6XBFJmpLSOvTpJzzb+jZszHV9O5lhe8rg0+6eWIg86a2PF3j6lUO2kM6WTmFczb9JqZCrag8KuQ0ju5VmsnjM6jPTjIo+Q+2sCORDtNMoxvgnEbCIuCw/gVknvqksk9+oIwHbquc84xRn8jWNIJY/9SYtRUIp5dlY0C+UOScvtSXrXhrpTBynGhUnyAq9l3o/kXOewSiL7jzbj14x7tmKZGXyRKumJIiWQ7kfRDlI08BtOytzTLuDeiJ0gg8WoYyD9SVBCinaaqKeehl7amtP79WEQIxlDJWtZyya20lSUeGAmEL/OiuYvWaTevFVGSktHbkgsxpOIJEngCZbzyc5PJnAav3bcf5gRnMQ0juIgqikhRpo0LTSxhdW8zh9426F4OZEp1FJCjBgfcTcNzuc2iCuozRzrQ/x31v8PZAKDqaacSspJUGoVfQFibOVu54mUhnBF6IChBu5ms/MZmEoYxXFMZiyHMJgqoIMmtrOO5fyJV3i3W3XZFtozvfxiLjWJjJRVB6kmXoSGcaayMzOOd6XX3Kb9jdlRGzkx0t4vMwbav9HZgnWzMSb5ybxtEV+gPfOtZk4uuJdD+AHv5Z2iLE2azdzv0EXyu0aIJq8z/qIxg+A2js75/2/TmmeOwa6/DxnpvL9xbA3ZWprNmYzIRxlTuY8PCxztRzzM6V4R2zaezcbWvuYVdq4R8vHwQpZLHaTaKGLt9OrNa2ovMAWYq93dr+cb7f0nOE4BVugOcga/40bGFKy0DeRSHuUfQnLdF4xxi32Y5nxmcc4yfovXeDfnGweRCP21kvjcpcMLyx1e29tlFHfxCF9hRIGjHcR5zOcnDPHe+i4t1r3cb26SJuN1//DimUsCGWik9fbIrVjFSCC7o/lSns58Us0l3Zq+JcYs7uMop+8O4WbuYHCBbyzhHePd1EyhKcwh1mTMz1gFgV2iZkx71iTmcbnTWVdzNffwiUh7abSKrn6/vjlZXP/w/rwuCcS8bTd4lh27tt8W8KP72p2fJXnQ6Dz/ecY7h8z1NX6a06urgwa2syMgSce5jNsKTL6/w0i6cCTjHM/sJOMqb+a5gG80OW7JXfH7WX2Suzk259MOmmkKjDdncEeku0iTFc39EojZpDPImg4xUHglvZrPGu82e+VkMzg087reo8KaT9cIt5d4lVM6Xw/hApaEhg1OImfzo8yAVYAmXmchS9lAC3HqGMVETuRwKyO5kE1cnzej+D3XZLbYl6m84nBeZVYBazHvBXxnOcsooZQKyolTShmlxIjnVNVddbCFODHilFBKnF1dE7szJrGcf7TuxGlW8gpvsoodJKllGEdxHEdaxZoZ/JirvGNGE2uM+uAnKfFoW11LW6bmUcfRDjEnxJW0GNWaf/UIeRYbjJDPRFwqx6ykv2jUAGYblcD3ApsOzEp6U+B6EiNZahxhBws4PaCOMZw5vG1VMpsLPMOvYaHxzeddppbhCGvm/KsCv5NgIIMZzmjGMp5j+RzTOYtzrUrnKo8iSzljGM+nmMgJTGU6n2cG53IhtxnXdQNjPH6pM2gyjuXPXM3InOQ2gC/wlPG7pElyrcc+dvuesYVGrvNI1mPZaIR9yrkQHKiKq622jkbnqUNLuYgPrUh1q2PIbGYCWWSUGYfxTubzFF8PCBmeQI7krUx02Mq3C1ysQ7jfapX5U4GiwQ3G97YGFDlyXWmEWMcRXtfnYuP6+CSQfM4yrppPAinhTmMWzXkclvebtXwnKykN9z7KKTRa8fIGp4wIoIrnrUzxPwrWKfOebDV/w5dZQKsVyR9xmEkoTn+mcC8NVkj3pJXNTCDPW026Nxnbf8EqKO1iJ5DgJteDuYx7eZnH+XzIcdTwSyvfm533m8eyxfjmt0LPsILHje/P92z+vKTICWRGxAQSYwSn8k0eYCE/DFkirYQfG2fcxjneR1nFAit+tfM4MxjodCe50pqhN8VrzOHwfDHbroNUMpPDGMwQhnMIB2VVfzZwS4GWqEmcRgk1DGMMh+ekZ3u6yKjsWTYe5orM1HAT+RyPRdjiWu7jfqroCG1CaOB7fIpjOt/FOZv/zFMPWcZipmfeTeOOkNH4Y5hknOECz3bCIjzoskR9oJtmDWt4hjjltIRsI8lPOJHjOt+VMYHfee6tiX/laGNK3FLOZCrLWcZaGmljHqvzhn2Ic4wG+BiTmMh63mMFm2knxXzezxf0IFbkfbjTxBUFD/navCHTvOFVlrWZd5A/WPWYOL8w9vFQTs57rsMdxM83jP0tt2Ystl1jfG9zwEM/299btYhRnsd0UZHvIGcaBSW/OoifLxv7ibYQ32XsyBPfWphSMOQEa3lP+y/F2eZXs29J+VL+Jq4POY38Odm7fL1IYxZSWe8eNNo/pvGprG8XvxlzEVsyr/sWqLE8azzIHBjyDL8Pp1t7WF30o+6dnuLtzOvBkZ6q38+387R/hbVpvc1s3sjzf1kPW91q/41cy10Ruymu5ApejxQyV3byfcUouA3IWXeu+COqVxnTbycKDLdZYTXunlaw5jY2U2yDdh4vepHJ157q9bzF+O2qvKbu6TrSudwY8QHqG1zi1ADveGBVnMHTbIt0KC1FnTTa/vl28mtOzeQ+M7nTmkk2evIoJU5J5x/EKKWMSqo5zmhvKTSzaxsLmJnZ/6c5PKfrYZepRoX2fY8RkrslSRc1Iyj2bIollFHR+axlV5a16ymOObV4FYlI/Szq8q6bGSbGIU6zc+YkkOBLHeNS2rm24AOdfD/SWH7FbN6MeCK23J/uad7KVHEPY4a1aq5vtOnDOI5mNIPoT4IE5ZRTTowYpSSopIK+xh03XrBYsJA1mfrAIKbkTSDVRnUe/uA0Kbetg1RRJhw1t9d9pQxnDJ9kFMOpox/llHT2cd6VQBJUGhlMZaQi1nBu5wuB/xP+y1/Oj6hzCWsnkDQNNJKilPKcB/iz2MyNBcZFtNFAmjiJnB6Sn+JnfIm/dud657WVh4w2oIv4T6MTgv2MuXC+WMOZXMbkPBctSOEEsoo/GqtxT2dunhxyrFFzaubxCFfAr4PintjeAE5jJhMZ5vxoOEpvgBp+HJA8Wmgnzc6Q8Ttn8C85v3SKFjrInlouK4FsYxaVQIJhTOQ0xllzJF3NYh7Ou9Pf8iZpSunHOE7hs1YBZBI3M7sHehMBPMqVmZlOjmEKj2T+p8R5Vq7j+Q6nes7/XnioZ5LHuTBzdT/NmDxdGk41fqhleSuOhUTpcVtIslt3kBLO5ptM8qxTROngMjurN0M9z/Ms79FIilTBiSdyl49ezjO8ytrOPiPv42go11udRdIsspbSya+S01lkhWwtsFZ6YWYz71OB3ZNvMfbzsBFtv2KEbMjbKT7OLKujh+tfR8gZHcxy49vBqzPWWFfpnyJdn+lGV6BiNPN+1njE69vMW8lNWQ+I3f5WFGgyDzaa960tvMxpjhlcjB9aIbdyU6GrViilb+AWljHXWEZtIpOs3qr57OQplvATvpT5JMFxzPe8CK7m8dVMjjCFY3g1c27hd5AYc/hhVnW7me3U00AD7XTQRopk5780UzK9bsPGQq/lOWP+4On8POBx4ZFG5756nox09sUuYkWvpJfyf7ghq2jexGZ28DFtdEBns0cppZRRxshMQ7nfDO0AZ1tdWV7iMuci/GjrzrORq/h/3btgs6zOijd5hDyIl4yQv4lYlQy/g5TygLGfn2Y+v8L49OPMc1vbTLZb+ckyfsAURjOIWiooo4wSSjJ9Zkv5nfHdWSFHfqYxEnMLnw74xj8aW3vOuTeR7RSai3oHmUR9xDvIl6weVmmW8X1OZiT9qaKCBAkqqKQP1dTSj0E8mvnmSs/jTvCYsZ/tTPUIe4ExbrQtsA+fJbys+DCX8bnMu3EeXYs38lujYNOX0h6aU6uDX3NOptHubG5nJUBWFT0oXxzBTUahsYm7uL3gQqP2VsIS/Gu8m3mKPoCpOTWMWk4z3j0RsTm82M2yUbd3MN82Gk7ruYO7Q+Zl7GpOKfHMPPta/Q1e5kWPsKONu9W7BerUncIPrMFqmx/u1nrc6X2jX1HfHlzO68VMsQpGMaPzVXgCudRoQ9rJjdxQ1HV4t1jF0ek5o9eOZELm9UeRV1DsLX2xLjbOpoHruDF02tKuhwa+lfS+VhvUm14PC81lZf8S/mzP5cDM0l0/l5VBM3YYTWZV3RikH6aBB4z72oWdl89uOsyNSIOtavZ93BF6b/R9Nv+kcVc4miOz/vdUo7PKa4GDpFxEjdD5txfFAC4w3v3caQ3Jru6hvnWQKiuzXesZtsvm8NKQSwLZZNwHalxW5cloNNJ2ogcTCDzJsszrYzqLhOZFD/rZjzbm7NjIz5zmvvLL6ZYYDwjrsjr81xrv0yyIPOa82F1DoiW4Y4zBxSuZ67QNc7VAv+taYy3t97FHyLg1LMKhUOtyYM1G1PFbjWGnkbT6RBxR6GaD0UZWzsWUQdaiDbk/2THGEb3ulIP75nT1PGW8O93q3jjBGEm/lucjn3nxE0gUxxsli+c664BhzF4JfgkkYc0W7VN3i1ux0CFLdEsg5rpuPveBpJFLlPfwQswPG/WHU5hA9sSSuT+8uYjb204NCGXeAzSfNqqiE6z+xtOMbb3oGKWC9IY7SIk1OcXrjlvoyst9i64J4/t+y8raq4k4HKdvAvFdz8ecIjJKj013y42OGgO5AKzaUu7PXmaNenObvrQqZKRcrndYnHldY3Rs72sUsJIs6NbUpnu/DlJhPOjrYKNTmITxfM1XeeQ1z2K+sdAlgXQYh+B3BzH7tfgttugvzYPGtJvn8omsIl32D2/P6eoWLYaHTxOTpdl6/DedAZ2vzALWqm6NtuwNk3KbC4W73oEGGzPz+95B+vjeBzLivquluSSQpHUf8CmFtxsFl4RX+1cUf2Jh5vVhnBdSB0lZhaq+uDjB+w4CfzAGTx2R6Vg53Xh6v7Cojct7gzljc2kmEyjsMxwSeX/l3UggZjbt0ETukkDMhQ99l203q/c9WUkHaOUBI9JfljU7SPZl7LCmeR7rcCUG8+UIR7XceEZTyVkA9Dc6ubexoFt3gd5QB2kznmnEAvsMZKtltlUW8buDRJ9J0y7HFOkOYi675nczTForARVz1EKwZ42n1eOtmXFzf/a0Nbhqcmhnh1KuY2KEY2rjCWPfUzkYmGhUalcYCWhf1WI9K5vqULuYY3UP8S1iRY9JJb6Pq112Zc/H63MqqchLZUWznd8YZxZ2x1pinNfokOXc4lzFNyKO3FtoPMo6jM8BM4zi5rOOldrebbGRCRxhdFINdgn/YMUG38yzO8097mOEANc6SNRFc9LWUlk9n0DgsTwjAYIKDm/wgfHuKqPHWbZyvsU/R65DrTT6CpUwk9FGC9ZOnujmGRe7L1a0B4Uvsj7zOsaVBabLi/EV/j1nuJJvM29U3vMU9HQC6brYfgudRPUBv817LNk+ZIHxbjg/y8z2axvNHXzfqweBrYMFxhU8kW8aMxZHGyRlajcyIb8mz2Btkbb3vtVa9wluY2zg9wZwE7fnTBbueweJXpuNh/avyOJys4q+7Fraqt73dCV9l3nMCphMMjhfvIdzjVl9j+BB5vIAKzNNCwkOZSZf6/bsUC+yOjPqcYhVPX2GrY7bmMTkgFaXFCON/LSWWWzLySNjNPDbnA4Z/TmHPgE1s4OM36mKS9mUs704b+X0n00ylzONpyHHM49beZqPMnGnhCFM4W85MSAP900g0dtDS3zbv1wSSPRl18w1RfdUAlnK77nU8btvcyu3GtF1CN9lFq/zDpuJcxDjOdqqcO5kA4dGqImsYVEmgZh30garK0phM7gx9DsD+EGe/b+Qk0CG8qOcnDxbLd8N/Pw/AjqYL+bf+KGRPx/JL1jBUj5kG1DHoYznMCO+/Zl1maKmbwKxW6J8ioQlVox3yPhdEkj0tdGTVvvXnihiQQcPcG5OgSjfZbyb0VxtRfkRjOC8wO+u4SZauTfCeaR4gksDwi0tMB1Qtu5cvbTHp9HdxSjmGNeylLF5ClrwGnP4bCaB+PbFit6KZfcEKVJfrHZrugW/Viyz/atnu5p0eYmXAz4Njg4t3MitTnMyLeIC7mFzxGj1Cn8J+PQZ6p230NOPWbuvmRv4uVNp4//zZZYY3d19G3DMzMKvfFNmJRCHWZDdKunmqfikXnvRXZ+hVibfIk2jNTok7Dwb+A5zQvry1vMTLuLVCMey23oWBezZZXz/bt0Zblb8SViD1XM937NWf8q1mR/wVf4CfJzJbHx7SZuF9aTXZN92HcShZORWSe+K5r6L7poRtZ/XRei6AM2dP3Cpc7/Np1jCBFrpIEmadtpYVyBsO/fzIldwUWDnhx0s5E6e7zyTJDs7X8U8OxjOZxoD2JXjpWmlg8Us9Qgfoz1il8Y4OwPueyl2hs7CHqy0QJRs4l94jWs4MaDfc5r1PM3/5dXOvW5gOf0oo4ykVxKOWdv2qwDYCcQhPrnVQZqM7/t0+LZvfw7Ltgd4trN7xq51wN1yi03MZghNtNBGijZaaQ1pLVrJDdzDNCYylBrKSdNKA5t4h5eswsCbnJP5Mf3GAC5kGnXESJIkRSttWUtRhvl35kUs3sVoMfqD7fYhl0Ss18QK9h1L8QwvcQwnMI6h9KMEaGULq3iDV3nfyDJfZxpVlFNJlbX0aRi7uafdq7t7hXXORZsjwVzm6+88wpUaM1ekeWAPdDbpvnKq6Utfqq1RB+IvRgX9qKOO2qI20JTzlBGrNljjesKcaMy80p5n4lKLW8XZrMT6PBOw6yCjqPYaHrl3tO4jCy73fmlairCyca5Ka+KFBq8RhQOMSnqby3Tsbnn6DuP1KR6z4KWtyDYu7+yGIu6GW2safuSV6R5l3BIaAgqeOdwSiJnSJvB156JHyuihAzV81+hkIRJFOX9rLaD6lscd5FhjQnFY45JA3JxvzEaX5mOucZ4FcDyrrNn2nmPyPlETkd5pJHdaC8s2OM+qWMm5LLPi4m0uwdzuBSP5vVX3aOOPPMcqdtBCko0F59L+e26x9rKJJ1nISnbQSpKtVvFNJFsFlUCcWg5hCl/MGgb3MJcWqOeMJEEzpQzm08zgZOtJ3A5m8kLxDvMaa5XwXX9JWmmmlXsL3hPq+H1OyBSNbGY9G/LMei6y21dZwpv8Nx9kzfy7qwXr+AIhY8xlE39hddb8y7v+7ipuz45a5gXsxG1a6omszBv2p477lwNV/tWT27i2YMgSHs4b9jXX6bJd6wMfc33enqdhj6/+xDfyTg8ZbUZzOXBsyxO/2rmFnxUMWZo3dr3HNaEzB0cwlLtoDEiNDzoks5N5NTAl36eHcVLQBQGF+zRr+UZo77Q+vBAY5xZFmlvASRln8RjbPItYuwzjOyy1WiDSpJ0mOZYD2dlZCaSdldyZWVaikBpeyYptrSzh+oDhdAX4VVTaeZxnmcBJTGQUA6mmgirHHkLruZlfMpnPMJ6DGUAV5XzMc3vsQsu+aRNLKaONJprZwl9ZwpusdopzCSo6u2Q2sZ21LOVlXvd99hG1gFNCDX2ppY7+bOOPXt3oEtRSRz9q2Mx7Xp2V5cCToI4UHbTTbo2/D9eHaaTZwQ4aqaexh5ZvEhERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERkd7gfwCOXZsMk3xQXQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wMi0xMFQxMzoxNDoyMCswMDowMCf6BL8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDItMTBUMTM6MTQ6MjArMDA6MDBWp7wDAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTAyLTEwVDEzOjE0OjIwKzAwOjAwAbKd3AAAAABJRU5ErkJggg==";

// src/two-pager/pdf/addPageNumbers.ts
var DEFAULT_COLOR = rgb(107 / 255, 114 / 255, 128 / 255);
var WATERMARK_COLOR = rgb(200 / 255, 200 / 255, 210 / 255);
var base64ToUint8Array = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};
var addPageNumbersToBytes = async (bytes, opts = {}) => {
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  const fontSize = opts.fontSize ?? 7;
  const marginRight = opts.marginRight ?? 48;
  const marginBottom = opts.marginBottom ?? 48;
  const logoPngBytes = base64ToUint8Array(NAVIIA_LOGO_PNG_BASE64);
  const logoImage = await pdfDoc.embedPng(logoPngBytes);
  const logoAspect = logoImage.width / logoImage.height;
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const wmText = "NAVIIA";
    const wmFontSize = 80;
    const wmTextWidth = boldFont.widthOfTextAtSize(wmText, wmFontSize);
    const angle = 35 * Math.PI / 180;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const wmX = width / 2 - wmTextWidth / 2 * cosA + wmFontSize / 2 * sinA;
    const wmY = height / 2 - wmTextWidth / 2 * sinA - wmFontSize / 2 * cosA;
    page.drawText(wmText, {
      x: wmX,
      y: wmY,
      size: wmFontSize,
      font: boldFont,
      color: WATERMARK_COLOR,
      opacity: 0.18,
      rotate: degrees(35)
    });
    const headerLogoHeight = 60;
    const headerLogoWidth = headerLogoHeight * logoAspect;
    page.drawImage(logoImage, {
      x: 12,
      y: height - 4 - headerLogoHeight,
      width: headerLogoWidth,
      height: headerLogoHeight,
      opacity: 1
    });
    const label = `Page ${index + 1} / ${totalPages}`;
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const x = Math.max(0, width - marginRight - textWidth);
    page.drawText(label, {
      x,
      y: marginBottom,
      size: fontSize,
      font,
      color: DEFAULT_COLOR
    });
  });
  return pdfDoc.save();
};

// src/two-pager/pdf/TwoPagerPdfDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";

// src/two-pager/pdf/sanitizePdfText.ts
var SOFT_HYPHEN = "\xAD";
var MAX_TOKEN = 32;
var DATA_URL_RE = /data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+/gi;
var chunk = (text, size) => {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out.join(SOFT_HYPHEN);
};
var UNICODE_SPACES = /[\u00A0\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/g;
var UNICODE_HYPHENS = /[\u2011]/g;
var sanitizePdfText = (input) => {
  const cleaned = input.replace(DATA_URL_RE, "[image]").replace(UNICODE_SPACES, " ").replace(UNICODE_HYPHENS, "-");
  return cleaned.split(/(\s+)/).map((part) => {
    if (!part || /\s+/.test(part)) return part;
    if (/^(https?:\/\/|www\.|mailto:)/i.test(part)) return part;
    return part.length > MAX_TOKEN ? chunk(part, MAX_TOKEN) : part;
  }).join("");
};

// src/two-pager/pdf/TwoPagerPdfDocument.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var SOFT_HYPHEN2 = "\xAD";
var HARD_WRAP_AT = 14;
var chunk2 = (text, size) => {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
};
var splitAfterDelimiters = (text) => {
  const DELIMS = "/-_.,:@";
  const parts = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (DELIMS.includes(ch)) {
      parts.push(buf);
      buf = "";
    }
  }
  if (buf) parts.push(buf);
  return parts;
};
Font.registerHyphenationCallback(
  (word, original) => {
    const base = original ? original(word) : [word];
    return base.flatMap((syllable) => {
      const hasSoftHyphen = syllable.endsWith(SOFT_HYPHEN2);
      const core = hasSoftHyphen ? syllable.slice(0, -1) : syllable;
      const parts = splitAfterDelimiters(core).flatMap(
        (p) => p.length > HARD_WRAP_AT ? chunk2(p, HARD_WRAP_AT) : [p]
      );
      if (hasSoftHyphen && parts.length) {
        parts[parts.length - 1] += SOFT_HYPHEN2;
      }
      return parts.length ? parts : [syllable];
    });
  }
);
var palette = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  card: "#F8FAFC",
  text: "#111827",
  muted: "#6B7280"
};
var styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: palette.text,
    lineHeight: 1.4,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: {
    flexDirection: "column",
    flexGrow: 1,
    marginRight: 10,
    minWidth: 0
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: palette.text,
    marginBottom: 2
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette.primaryMuted,
    color: palette.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  section: {
    marginBottom: 12
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    padding: 10
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: palette.text,
    marginBottom: 8
  },
  infoRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: palette.border,
    alignItems: "stretch"
  },
  infoLabelCol: {
    width: 130,
    paddingVertical: 8,
    paddingRight: 10,
    backgroundColor: palette.card,
    borderRightWidth: 1,
    borderRightColor: palette.border
  },
  infoLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    color: palette.muted
  },
  infoValueCol: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
    paddingHorizontal: 6
  },
  infoValue: {
    fontSize: 8,
    color: palette.text,
    flexShrink: 1
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    overflow: "hidden"
  },
  metricItem: {
    width: "33.33%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: palette.border,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.card
  },
  metricLabel: {
    fontSize: 7,
    color: palette.muted,
    marginBottom: 4
  },
  metricValue: {
    fontSize: 10,
    fontWeight: 700,
    color: palette.text
  },
  card: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    flexGrow: 1
  },
  managerCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
    backgroundColor: "#ffffff",
    width: "48%"
  },
  initials: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.primaryMuted,
    color: palette.primary,
    fontSize: 7,
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.6,
    marginRight: 6
  },
  managerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  placeholderBox: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  timelineItem: {
    borderLeftWidth: 1,
    borderLeftColor: palette.border,
    paddingLeft: 10,
    marginBottom: 8
  },
  timelineYear: {
    fontSize: 9,
    fontWeight: 700,
    color: palette.text,
    marginBottom: 3
  },
  badge: {
    fontSize: 6,
    color: palette.primary,
    backgroundColor: palette.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6
  },
  badgeBox: {
    backgroundColor: palette.primaryMuted,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2
  },
  badgeText: {
    fontSize: 6,
    fontWeight: 700,
    color: palette.primary,
    lineHeight: 1.1
  },
  table: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: palette.card,
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  tableHeaderCell: {
    fontSize: 7,
    color: palette.text,
    fontWeight: 700,
    flexGrow: 1
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  tableCell: {
    fontSize: 7,
    color: palette.text,
    flexGrow: 1
  },
  muted: {
    color: palette.muted
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2
  },
  bulletGlyph: {
    width: 10,
    fontSize: 8,
    color: palette.muted
  },
  bulletText: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    fontSize: 8,
    color: palette.text
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 8
  },
  pillBox: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    alignSelf: "flex-start",
    justifyContent: "center",
    backgroundColor: palette.primaryMuted
  },
  pillLink: {
    textDecoration: "none"
  },
  pillText: {
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1,
    color: palette.primary
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    flexShrink: 0
  },
  avatarText: {
    fontSize: 8,
    fontWeight: 700,
    color: palette.primary
  },
  managerRow: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  managerTextCol: {
    flex: 1,
    minWidth: 0
  },
  managerName: {
    fontSize: 9,
    fontWeight: 700,
    color: palette.text,
    flexShrink: 1
  },
  shareholderName: {
    fontSize: 9,
    fontWeight: 400,
    color: palette.text
  },
  managerLink: {
    fontSize: 7,
    color: palette.primary,
    marginTop: 2
  },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette.muted,
    textDecoration: "none"
  }
});
var inpiVizStyles = StyleSheet.create({
  // whole block inside sectionCard
  wrap: {
    marginTop: 2
  },
  // ---- Top KPI rows (pills) ----
  kpiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  kpiLabel: {
    width: 120,
    fontSize: 7.5,
    color: palette.muted,
    textTransform: "uppercase",
    fontWeight: 700
  },
  kpiPills: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  kpiPill: {
    width: 44,
    borderRadius: 999,
    paddingVertical: 6,
    backgroundColor: palette.primaryMuted,
    alignSelf: "flex-start",
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  kpiPillAlt: {
    backgroundColor: "#F3F4F6"
  },
  kpiPillText: {
    fontSize: 8,
    fontWeight: 700,
    color: palette.text,
    lineHeight: 1.1,
    textAlign: "center"
  },
  // ---- Chart ----
  chartRow: {
    flexDirection: "row",
    marginTop: 6
  },
  legendCol: {
    width: 90,
    paddingTop: 20
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  legendText: {
    fontSize: 9,
    color: palette.text,
    fontWeight: 700
  },
  plotCol: {
    flex: 1,
    minWidth: 0
  },
  plotArea: {
    position: "relative",
    height: 150,
    paddingHorizontal: 8,
    paddingTop: 6
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: palette.border,
    opacity: 0.7
  },
  barsRow: {
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  yearGroup: {
    alignItems: "center",
    justifyContent: "flex-end"
  },
  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  barStack: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 6
  },
  barValue: {
    fontSize: 9,
    fontWeight: 700,
    color: palette.text,
    marginBottom: 6
  },
  bar: {
    borderRadius: 2
  },
  yearLabel: {
    marginTop: 10,
    fontSize: 9,
    fontWeight: 700,
    color: palette.muted
  }
});
var INPI_SECTION_ORDER = ["performance", "croissance", "autres"];
var inpiTableStyles = StyleSheet.create({
  wrap: { marginTop: 8 },
  table: { width: "100%" },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#F8FAFC",
    paddingVertical: 4
  },
  headerLabel: {
    width: "32%",
    paddingLeft: 6,
    fontSize: 7.5,
    fontWeight: 700,
    color: palette.text
  },
  headerCell: {
    flex: 1,
    paddingRight: 6,
    fontSize: 7.5,
    fontWeight: 700,
    color: palette.text,
    textAlign: "right"
  },
  sectionRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    paddingVertical: 3,
    paddingLeft: 6,
    marginTop: 4
  },
  sectionTitle: {
    flex: 1,
    fontSize: 7.5,
    fontWeight: 700,
    color: palette.text
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: palette.border,
    paddingVertical: 2
  },
  dataRowAlt: { backgroundColor: "#FAFAFA" },
  dataLabel: {
    width: "32%",
    paddingLeft: 6,
    fontSize: 7,
    color: palette.text
  },
  dataCell: {
    flex: 1,
    paddingRight: 6,
    fontSize: 7,
    color: palette.text,
    textAlign: "right"
  }
});
var groupInpiSeriesBySection = (series) => {
  const buckets = /* @__PURE__ */ new Map();
  series.forEach((s) => {
    const key = String(s.section || "autres").toLowerCase();
    const title = INPI_SECTION_ORDER.find((k) => key === k) ? key.charAt(0).toUpperCase() + key.slice(1) : s.section || "Autres";
    const bucket = buckets.get(key) ?? { title, items: [] };
    bucket.items.push(s);
    buckets.set(key, bucket);
  });
  const out = [];
  INPI_SECTION_ORDER.forEach((key) => {
    const b = buckets.get(key);
    if (b?.items.length) out.push(b);
  });
  buckets.forEach((b, key) => {
    if (INPI_SECTION_ORDER.includes(key)) return;
    if (b.items.length) out.push(b);
  });
  return out;
};
var isMissingValue = (raw) => /^\s*(n\.?d\.?|n\/a|na)\s*$/i.test(raw);
var shouldShowPlus = (label) => {
  if (!label) return false;
  return /(croissance|cagr)/i.test(label);
};
var fmtInpiCell = (v, serie) => {
  if (v === null || v === void 0) return "\u2014";
  const raw = String(v).trim();
  if (!raw) return "\u2014";
  if (isMissingValue(raw)) return "n.d.";
  const num = parseMaybeNumber(v);
  if (num === null) return raw;
  const hasPercent = /%/.test(raw);
  const needsPercent = serie.kind === "%" || hasPercent;
  const base = raw.replace(/[()%+]/g, "").replace(/^-/, "").trim();
  const suffix = needsPercent ? "%" : "";
  if (num < 0) return `(${base}${suffix})`;
  const withPlus = (shouldShowPlus(serie.label) || raw.startsWith("+")) && num > 0 ? "+" : "";
  return `${withPlus}${base}${suffix}`;
};
var InpiTable = ({
  sections,
  years
}) => {
  if (!sections.length || !years.length) return null;
  return /* @__PURE__ */ jsx(View, { style: inpiTableStyles.wrap, children: /* @__PURE__ */ jsxs(View, { style: inpiTableStyles.table, children: [
    /* @__PURE__ */ jsxs(View, { style: inpiTableStyles.headerRow, children: [
      /* @__PURE__ */ jsx(Text, { style: inpiTableStyles.headerLabel, children: "Indicateur" }),
      years.map((y) => /* @__PURE__ */ jsx(Text, { style: inpiTableStyles.headerCell, children: y }, y))
    ] }),
    sections.map(({ title, items }) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx(View, { style: inpiTableStyles.sectionRow, children: /* @__PURE__ */ jsx(Text, { style: inpiTableStyles.sectionTitle, children: title }) }),
      items.map((item, idx) => /* @__PURE__ */ jsxs(
        View,
        {
          style: [inpiTableStyles.dataRow, idx % 2 === 1 && inpiTableStyles.dataRowAlt],
          children: [
            /* @__PURE__ */ jsx(Text, { style: inpiTableStyles.dataLabel, children: String(item.label ?? "Indicateur").replace(/\s*\(?m?€\)?\s*$/i, "").trim() }),
            years.map((y) => /* @__PURE__ */ jsx(Text, { style: inpiTableStyles.dataCell, children: fmtInpiCell(item.values?.[y], item) }, y))
          ]
        },
        `${title}-${idx}`
      ))
    ] }, title))
  ] }) });
};
var isMissing = (v) => {
  if (v === null || v === void 0) return true;
  const s = String(v).trim().toLowerCase();
  return s === "" || s === "n/a" || s === "na" || s === "n.d." || s === "nd" || s === "-";
};
var parseMaybeNumber = (v) => {
  if (v === null || v === void 0) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const raw = String(v).trim();
  if (!raw || isMissing(raw)) return null;
  let neg = false;
  let s = raw;
  if (s.startsWith("(") && s.includes(")")) {
    neg = true;
    s = s.replace(/[()]/g, "");
  }
  s = s.replace("%", "").replace(/\s/g, "");
  s = s.replace(",", ".");
  s = s.replace(/^\+/, "");
  const n = Number.parseFloat(s);
  if (!Number.isFinite(n)) return null;
  return neg ? -n : n;
};
var fmtPercent = (v, opts) => {
  const n = parseMaybeNumber(v);
  if (n === null) return "n.d.";
  const abs = Math.abs(n).toFixed(1);
  const sign = n < 0 ? "" : opts?.showPlus ? "+" : "";
  return n < 0 ? `(${abs})%` : `${sign}${abs}%`;
};
var fmtNumber = (v) => {
  const n = parseMaybeNumber(v);
  if (n === null) return "n.d.";
  const abs = Math.abs(n);
  const decimals = abs < 100 ? 1 : 0;
  const txt = n.toFixed(decimals);
  return n < 0 ? `(${Math.abs(n).toFixed(decimals)})` : txt;
};
var findSerie = (series, predicate) => series.find(predicate);
var LABEL_CA = "Chiffre d'affaires (\u20AC)";
var LABEL_EBITDA = "EBITDA - EBE (\u20AC)";
var getPrimaryLabel = (series) => series?.label ?? "S\xE9rie 1";
var getSecondaryLabel = (series) => series?.label ?? "S\xE9rie 2";
var InpiKpisVisual = ({
  series,
  years
}) => {
  if (!series.length || !years.length) return null;
  const barA = findSerie(series, (s) => s.label === LABEL_CA);
  const barB = findSerie(series, (s) => s.label === LABEL_EBITDA);
  const pill1 = findSerie(series, (s) => s.label === "Taux de marge d'EBITDA");
  const pill2 = findSerie(series, (s) => s.label === "Taux de croissance du CA");
  const primaryLabel = getPrimaryLabel(barA);
  const secondaryLabel = getSecondaryLabel(barB);
  const allVals = [];
  const collectVals = (s) => {
    if (!s) return;
    years.forEach((y) => {
      const n = parseMaybeNumber(s.values?.[y]);
      if (n !== null) allVals.push(Math.abs(n));
    });
  };
  collectVals(barA);
  collectVals(barB);
  const maxVal = Math.max(...allVals, 1);
  const BAR_MAX_H = 110;
  const CA_W = 26;
  const EBITDA_W = 18;
  const gridLines = [0.25, 0.5, 0.75].map((p) => ({
    key: `g-${p}`,
    bottom: p * BAR_MAX_H + 22
    // + some headroom for labels
  }));
  const yearWidthPct = `${100 / years.length}%`;
  return /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.wrap, children: [
    pill1 ? /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.kpiRow, children: [
      /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.kpiLabel, children: pill1.label }),
      /* @__PURE__ */ jsx(View, { style: inpiVizStyles.kpiPills, children: years.map((y) => /* @__PURE__ */ jsx(View, { style: inpiVizStyles.kpiPill, children: /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.kpiPillText, children: fmtPercent(pill1.values?.[y], {
        showPlus: pill1?.label === "Taux de croissance du CA"
      }) }) }, `p1-${y}`)) })
    ] }) : null,
    pill2 ? /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.kpiRow, children: [
      /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.kpiLabel, children: pill2.label }),
      /* @__PURE__ */ jsx(View, { style: inpiVizStyles.kpiPills, children: years.map((y) => /* @__PURE__ */ jsx(View, { style: [inpiVizStyles.kpiPill, inpiVizStyles.kpiPillAlt], children: /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.kpiPillText, children: fmtPercent(pill2.values?.[y], {
        showPlus: pill2?.label === "Taux de croissance du CA"
      }) }) }, `p2-${y}`)) })
    ] }) : null,
    barA && barB ? /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.chartRow, children: [
      /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.legendCol, children: [
        /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.legendItem, children: [
          /* @__PURE__ */ jsx(View, { style: [inpiVizStyles.legendDot, { backgroundColor: palette.primary }] }),
          /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.legendText, children: primaryLabel })
        ] }),
        /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.legendItem, children: [
          /* @__PURE__ */ jsx(View, { style: [inpiVizStyles.legendDot, { backgroundColor: "#BFD4F0" }] }),
          /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.legendText, children: secondaryLabel })
        ] })
      ] }),
      /* @__PURE__ */ jsx(View, { style: inpiVizStyles.plotCol, children: /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.plotArea, children: [
        gridLines.map((g) => /* @__PURE__ */ jsx(View, { style: [inpiVizStyles.gridLine, { bottom: g.bottom }] }, g.key)),
        /* @__PURE__ */ jsx(View, { style: inpiVizStyles.barsRow, children: years.map((y) => {
          const a = parseMaybeNumber(barA.values?.[y]);
          const b = parseMaybeNumber(barB.values?.[y]);
          const aH = a === null ? 0 : Math.abs(a) / maxVal * BAR_MAX_H;
          const bH = b === null ? 0 : Math.abs(b) / maxVal * BAR_MAX_H;
          return /* @__PURE__ */ jsxs(View, { style: [inpiVizStyles.yearGroup, { width: yearWidthPct }], children: [
            /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.barPair, children: [
              /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.barStack, children: [
                /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.barValue, children: fmtNumber(barA.values?.[y]) }),
                /* @__PURE__ */ jsx(
                  View,
                  {
                    style: [
                      inpiVizStyles.bar,
                      {
                        width: CA_W,
                        height: aH,
                        backgroundColor: palette.primary
                      }
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(View, { style: inpiVizStyles.barStack, children: [
                /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.barValue, children: fmtNumber(barB.values?.[y]) }),
                /* @__PURE__ */ jsx(
                  View,
                  {
                    style: [
                      inpiVizStyles.bar,
                      {
                        width: EBITDA_W,
                        height: bH,
                        backgroundColor: "#BFD4F0"
                      }
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx(Text, { style: inpiVizStyles.yearLabel, children: y })
          ] }, `yr-${y}`);
        }) })
      ] }) })
    ] }) : null
  ] });
};
var createCiteCtx = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations = (raw, ctx) => {
  LINK_ANY.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs(Link, { src: url, style: styles.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var valueToLines = (val) => {
  if (val === null || val === void 0) return ["N/A"];
  if (Array.isArray(val)) {
    const lines = val.map((v) => v === null || v === void 0 ? "" : String(v)).map((v) => v.trim()).filter(Boolean);
    return lines.length ? lines : ["N/A"];
  }
  const str = String(val);
  const parts = str.split(/\n+/).map((v) => v.trim()).filter(Boolean);
  return parts.length ? parts : ["N/A"];
};
var collectInpiSeries = (data) => {
  const sections = [
    { key: "performance", title: "Performance" },
    { key: "croissance", title: "Croissance" },
    { key: "autres", title: "Autres" }
  ];
  const newPayload = Array.isArray(data) ? data.find(
    (entry) => entry && typeof entry === "object" && (Array.isArray(entry.metrics) || Array.isArray(entry.years))
  ) : data && typeof data === "object" && Array.isArray(data.metrics) ? data : null;
  if (newPayload?.metrics) {
    const series2 = [];
    newPayload.metrics.forEach((metric) => {
      if (!metric) return;
      const sectionKey = String(metric.section || "autres").toLowerCase();
      const title = sections.find((s) => s.key === sectionKey)?.title || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
      const totals = metric.total_par_annee ?? {};
      const values = Object.fromEntries(
        Object.entries(totals).map(([year, entry]) => {
          if (entry && typeof entry === "object" && "valeur" in entry) {
            return [year, entry.valeur ?? "\u2014"];
          }
          return [year, entry];
        })
      );
      series2.push({
        label: metric.label || "Indicateur",
        kind: metric.kind,
        values,
        section: title
      });
    });
    const years2 = newPayload.years?.length ? Array.from(new Set(newPayload.years.map((year) => String(year)))) : Array.from(new Set(series2.flatMap((s) => Object.keys(s.values || {})))).sort(
      (a, b) => a.localeCompare(b, void 0, { numeric: true })
    );
    return { series: series2, years: years2 };
  }
  const series = [];
  sections.forEach(({ key, title }) => {
    const arr = Array.isArray(data?.[key]) ? data[key] : [];
    arr.forEach((item) => {
      if (!item) return;
      const values = item.values && typeof item.values === "object" ? item.values : {};
      series.push({
        label: item.label || "Indicateur",
        kind: item.kind,
        values,
        section: title
      });
    });
  });
  const years = Array.from(
    new Set(series.flatMap((s) => Object.keys(s.values || {})))
  ).sort((a, b) => a.localeCompare(b, void 0, { numeric: true }));
  return { series, years };
};
var initialsFromName = (name) => {
  if (!name) return "MG";
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "M").concat(parts[1]?.[0] || "G").toUpperCase();
};
var isBulletLine = (line) => /^\s*[•-]\s+/.test(line);
var FieldRow = ({
  label,
  value,
  bulletify = false,
  citeCtx: citeCtx2
}) => {
  const lines = valueToLines(value);
  return /* @__PURE__ */ jsxs(View, { style: styles.infoRow, children: [
    /* @__PURE__ */ jsx(View, { style: styles.infoLabelCol, children: /* @__PURE__ */ jsx(Text, { style: styles.infoLabel, children: label }) }),
    /* @__PURE__ */ jsx(View, { style: styles.infoValueCol, children: lines.map((line, idx) => {
      const lineIsBullet = isBulletLine(line);
      const useBullet = bulletify && line !== "N/A" || lineIsBullet;
      if (useBullet) {
        const text = lineIsBullet ? line.replace(/^\s*[•-]\s+/, "") : line;
        return /* @__PURE__ */ jsxs(View, { style: styles.bulletRow, wrap: true, children: [
          /* @__PURE__ */ jsx(Text, { style: styles.bulletGlyph, children: "\u2022" }),
          /* @__PURE__ */ jsx(Text, { style: styles.bulletText, wrap: true, children: renderInlineCitations(text, citeCtx2) })
        ] }, `${label}-b-${idx}`);
      }
      return /* @__PURE__ */ jsx(Text, { style: styles.infoValue, wrap: true, children: renderInlineCitations(line, citeCtx2) }, `${label}-${idx}`);
    }) })
  ] });
};
var TwoPagerPdfDocument = ({
  doc: doc2,
  data,
  brandLogoDataUrl,
  companyLinkedinUrl
}) => {
  const citeCtx2 = createCiteCtx();
  const { series: inpiSeries, years: inpiYears } = collectInpiSeries(data?.kpisInpi);
  const inpiYearsLimited = Array.isArray(inpiYears) ? inpiYears.slice(-6).map((y) => String(y)) : [];
  const metricItems = (data.kpis || []).map((kpi) => ({
    label: kpi.label || "KPI",
    value: kpi.value ?? "N/A"
  }));
  const Pill = ({
    children,
    bg,
    color,
    href
  }) => /* @__PURE__ */ jsx(View, { style: [styles.pillBox, { backgroundColor: bg }], children: /* @__PURE__ */ jsx(Text, { style: [styles.pillText, { color }], children }) });
  return /* @__PURE__ */ jsx(Document, { children: /* @__PURE__ */ jsxs(Page, { size: "A4", style: styles.page, children: [
    /* @__PURE__ */ jsxs(View, { style: styles.header, children: [
      brandLogoDataUrl && /* @__PURE__ */ jsx(
        Image,
        {
          src: brandLogoDataUrl,
          style: { width: 52, height: 52, objectFit: "contain", borderRadius: 8, marginRight: 12 }
        }
      ),
      /* @__PURE__ */ jsxs(View, { style: styles.titleGroup, children: [
        /* @__PURE__ */ jsx(Text, { style: styles.title, children: renderInlineCitations(doc2.name || "", citeCtx2) }),
        /* @__PURE__ */ jsxs(View, { style: styles.pillWrap, children: [
          doc2.website && /* @__PURE__ */ jsx(Pill, { bg: palette.primaryMuted, color: palette.primary, href: doc2.website, children: "Site web" }),
          companyLinkedinUrl && /* @__PURE__ */ jsx(Pill, { bg: palette.primaryMuted, color: palette.primary, href: companyLinkedinUrl, children: "LinkedIn" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(View, { style: styles.section, children: /* @__PURE__ */ jsxs(View, { style: styles.sectionCard, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.sectionTitle, children: "Informations g\xE9n\xE9rales" }),
      /* @__PURE__ */ jsx(FieldRow, { label: "Secteur", value: data.characteristics.sector, citeCtx: citeCtx2 }),
      /* @__PURE__ */ jsx(FieldRow, { label: "Sous secteur", value: data.characteristics.subSector, citeCtx: citeCtx2 }),
      /* @__PURE__ */ jsx(
        FieldRow,
        {
          label: "Pr\xE9sence g\xE9ographique",
          value: data.characteristics.geographicFootprint,
          citeCtx: citeCtx2
        }
      ),
      /* @__PURE__ */ jsx(
        FieldRow,
        {
          label: "Position dans la cha\xEEne de valeur",
          value: data.characteristics.valueChain,
          bulletify: true,
          citeCtx: citeCtx2
        }
      ),
      /* @__PURE__ */ jsx(
        FieldRow,
        {
          label: "Business model",
          value: data.characteristics.businessModel,
          bulletify: true,
          citeCtx: citeCtx2
        }
      )
    ] }) }),
    metricItems.length > 0 && /* @__PURE__ */ jsx(View, { style: styles.section, children: /* @__PURE__ */ jsx(View, { style: styles.sectionCard, children: /* @__PURE__ */ jsx(View, { style: styles.metricGrid, children: metricItems.map((m, idx) => {
      const itemsPerRow = 2;
      const isEndOfRow = (idx + 1) % itemsPerRow === 0;
      const lastRowStart = metricItems.length - (metricItems.length % itemsPerRow || itemsPerRow);
      const isLastRow = idx >= lastRowStart;
      return /* @__PURE__ */ jsxs(
        View,
        {
          style: {
            width: "50%",
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRightWidth: isEndOfRow ? 0 : 1,
            borderRightColor: palette.border,
            borderBottomWidth: isLastRow ? 0 : 1,
            borderBottomColor: palette.border,
            backgroundColor: palette.card
          },
          children: [
            /* @__PURE__ */ jsx(Text, { style: styles.metricLabel, children: renderInlineCitations(m.label, citeCtx2) }),
            /* @__PURE__ */ jsx(Text, { style: styles.metricValue, children: renderInlineCitations(String(m.value), citeCtx2) })
          ]
        },
        `${m.label}-${idx}`
      );
    }) }) }) }),
    /* @__PURE__ */ jsx(View, { style: styles.section, wrap: false, children: /* @__PURE__ */ jsxs(View, { style: styles.sectionCard, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.sectionTitle, children: "Management" }),
      data.management?.length ? /* @__PURE__ */ jsx(View, { style: styles.managerGrid, children: data.management.map((m, idx) => /* @__PURE__ */ jsx(View, { style: styles.managerCard, wrap: false, children: /* @__PURE__ */ jsxs(View, { style: styles.managerRow, children: [
        /* @__PURE__ */ jsx(View, { style: styles.avatar, children: /* @__PURE__ */ jsx(Text, { style: styles.avatarText, children: initialsFromName(m.nom_prenom) }) }),
        /* @__PURE__ */ jsxs(View, { style: styles.managerTextCol, children: [
          /* @__PURE__ */ jsx(Text, { style: styles.managerName, wrap: true, children: renderInlineCitations(m.nom_prenom || "Manager", citeCtx2) }),
          m.profil_url && /* @__PURE__ */ jsx(Text, { style: styles.managerLink, children: renderInlineCitations(m.profil_url, citeCtx2) })
        ] })
      ] }) })) }) : /* @__PURE__ */ jsx(Text, { style: styles.muted, children: "Aucun manager renseign\xE9." })
    ] }) }),
    /* @__PURE__ */ jsx(View, { style: styles.section, children: /* @__PURE__ */ jsxs(View, { style: styles.sectionCard, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.sectionTitle, children: "Actionnariat" }),
      data.shareholding?.length ? data.shareholding.map((s, idx) => /* @__PURE__ */ jsxs(View, { style: { marginBottom: 6 }, children: [
        /* @__PURE__ */ jsx(Text, { style: styles.shareholderName, children: renderInlineCitations(s.nom_actionnaire || "Actionnaire", citeCtx2) }),
        s.participation && /* @__PURE__ */ jsx(Text, { style: styles.infoValue, children: renderInlineCitations(s.participation, citeCtx2) })
      ] }, `${s.nom_actionnaire || "actionnaire"}-${idx}`)) : /* @__PURE__ */ jsxs(View, { style: styles.placeholderBox, children: [
        brandLogoDataUrl && /* @__PURE__ */ jsx(
          Image,
          {
            src: brandLogoDataUrl,
            style: { width: 60, height: 60, objectFit: "contain", marginBottom: 6 }
          }
        ),
        /* @__PURE__ */ jsx(Text, { style: styles.muted, children: "n.d." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(View, { style: styles.section, children: /* @__PURE__ */ jsxs(View, { style: styles.sectionCard, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.sectionTitle, children: "\xC9tapes cl\xE9s de d\xE9veloppement" }),
      data.keyEvents?.length ? data.keyEvents.map((e, idx) => /* @__PURE__ */ jsxs(View, { style: styles.timelineItem, children: [
        /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", marginBottom: 3 }, children: [
          /* @__PURE__ */ jsx(Text, { style: [styles.timelineYear, { marginTop: 1 }], children: renderInlineCitations(e.year || "N/A", citeCtx2) }),
          e.category ? /* @__PURE__ */ jsx(View, { style: styles.badgeBox, children: /* @__PURE__ */ jsx(Text, { style: styles.badgeText, children: renderInlineCitations(e.category, citeCtx2) }) }) : null
        ] }),
        /* @__PURE__ */ jsx(Text, { style: styles.infoValue, children: renderInlineCitations(e.description || "N/A", citeCtx2) })
      ] }, `${e.year || idx}-${idx}`)) : /* @__PURE__ */ jsx(Text, { style: styles.muted, children: "Aucun \xE9v\xE9nement cl\xE9." })
    ] }) }),
    inpiSeries.length > 0 && /* @__PURE__ */ jsx(View, { style: styles.section, wrap: false, children: /* @__PURE__ */ jsxs(View, { style: styles.sectionCard, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.sectionTitle, children: "KPIs INPI" }),
      /* @__PURE__ */ jsx(
        InpiTable,
        {
          sections: groupInpiSeriesBySection(inpiSeries),
          years: inpiYearsLimited
        }
      ),
      /* @__PURE__ */ jsx(InpiKpisVisual, { series: inpiSeries, years: inpiYearsLimited })
    ] }) })
  ] }) });
};
var TwoPagerPdfDocument_default = TwoPagerPdfDocument;

// src/two-pager/pdf/TwoPagerPresentationPdfDocument.tsx
import {
  Document as Document2,
  Page as Page2,
  Text as Text4,
  View as View4,
  StyleSheet as StyleSheet3,
  Image as Image3,
  Link as Link2,
  Font as Font2
} from "@react-pdf/renderer";

// src/two-pager/pdf/shared/ImageBlock.tsx
import { Image as Image2, Text as Text2, View as View2 } from "@react-pdf/renderer";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var normalizeImages = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((im) => {
    if (!im) return null;
    if (typeof im === "string") return { src: im };
    if (typeof im === "object") {
      const src = String(im.url || im.src || "");
      if (!src) return null;
      const cap = (im.caption || im.description || im.legend || im.alt || "")?.toString?.() ?? "";
      return { src, caption: cap || void 0 };
    }
    return null;
  }).filter(Boolean);
};
var ImageBlock = ({
  images,
  styles: styles12,
  renderCaption
}) => {
  if (!images.length) return null;
  const renderCaptionText = (caption) => caption ? /* @__PURE__ */ jsx2(Text2, { style: styles12.figureCaption, children: renderCaption ? renderCaption(caption) : caption }) : null;
  if (images.length === 1) {
    const img = images[0];
    return /* @__PURE__ */ jsxs2(View2, { style: styles12.singleFigure, wrap: false, children: [
      /* @__PURE__ */ jsx2(View2, { style: styles12.singleBox, children: /* @__PURE__ */ jsx2(Image2, { src: img.src, style: styles12.singleImage }) }),
      renderCaptionText(img.caption)
    ] });
  }
  const rows = [];
  for (let i = 0; i < images.length; i += 2) rows.push(images.slice(i, i + 2));
  return /* @__PURE__ */ jsx2(View2, { style: styles12.grid, children: rows.map((row, rowIdx) => {
    const single = row.length === 1;
    return /* @__PURE__ */ jsx2(
      View2,
      {
        style: [styles12.gridRow, single ? styles12.gridRowSingle : null],
        wrap: false,
        children: row.map((img, cellIdx) => /* @__PURE__ */ jsxs2(
          View2,
          {
            style: [styles12.gridCell, single ? styles12.gridCellSingle : null],
            wrap: false,
            children: [
              /* @__PURE__ */ jsx2(View2, { style: styles12.gridBox, children: /* @__PURE__ */ jsx2(Image2, { src: img.src, style: styles12.gridImage }) }),
              renderCaptionText(img.caption)
            ]
          },
          `cell-${rowIdx}-${cellIdx}`
        ))
      },
      `row-${rowIdx}`
    );
  }) });
};

// src/two-pager/pdf/shared/SectionNav.tsx
import { Text as Text3, View as View3, StyleSheet as StyleSheet2 } from "@react-pdf/renderer";
import { jsx as jsx3 } from "react/jsx-runtime";
var SECTION_NAV = [
  "Pr\xE9sentation",
  "Actionnariat",
  "Management",
  "March\xE9",
  "Concurrents",
  "Insights",
  "Notes",
  "Deals",
  "Press"
];
var palette2 = {
  primary: "#4338CA",
  border: "#E5E7EB",
  muted: "#6B7280"
};
var styles2 = StyleSheet2.create({
  sectionNavFixed: {
    position: "absolute",
    top: 48,
    left: 48,
    right: 48
  },
  sectionNavWrap: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  sectionNavPill: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: palette2.border
  },
  sectionNavPillActive: {
    backgroundColor: palette2.primary,
    borderColor: palette2.primary
  },
  sectionNavText: {
    fontSize: 7,
    fontWeight: 700,
    color: palette2.muted,
    lineHeight: 1.1
  },
  sectionNavTextActive: {
    color: "#ffffff"
  }
});
var SectionNav = ({ active }) => /* @__PURE__ */ jsx3(View3, { style: styles2.sectionNavFixed, fixed: true, children: /* @__PURE__ */ jsx3(View3, { style: styles2.sectionNavWrap, children: SECTION_NAV.map((label) => {
  const isActive = label === active;
  return /* @__PURE__ */ jsx3(
    View3,
    {
      style: [styles2.sectionNavPill, isActive ? styles2.sectionNavPillActive : null],
      children: /* @__PURE__ */ jsx3(Text3, { style: [styles2.sectionNavText, isActive ? styles2.sectionNavTextActive : null], children: label })
    },
    label
  );
}) }) });
var SectionNav_default = SectionNav;

// src/two-pager/pdf/TwoPagerPresentationPdfDocument.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var palette3 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  card: "#F8FAFC",
  text: "#111827",
  muted: "#6B7280",
  soft: "#F8FAFC"
};
var SOFT_HYPHEN3 = "\xAD";
var HARD_WRAP_AT2 = 18;
var splitAfterDelimiters2 = (text) => {
  const DELIMS = "/-_.,:@?&=#";
  const out = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (DELIMS.includes(ch)) {
      out.push(buf);
      buf = "";
    }
  }
  if (buf) out.push(buf);
  return out;
};
var chunk3 = (text, size) => {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
};
var hyphenationInstalled = false;
var ensureHyphenation = () => {
  if (hyphenationInstalled) return;
  hyphenationInstalled = true;
  Font2.registerHyphenationCallback(((word, original) => {
    const base = original ? original(word) : [word];
    const parts = [];
    for (const syllable of base) {
      const hasSoft = syllable.endsWith(SOFT_HYPHEN3);
      const core = hasSoft ? syllable.slice(0, -1) : syllable;
      const byDelims = splitAfterDelimiters2(core).flatMap(
        (p) => p.length > HARD_WRAP_AT2 ? chunk3(p, HARD_WRAP_AT2) : [p]
      );
      parts.push(...byDelims);
      if (hasSoft && parts.length) {
        parts[parts.length - 1] += SOFT_HYPHEN3;
      }
    }
    return parts.length ? parts : [word];
  }));
};
ensureHyphenation();
var INLINE_ROW_MARGIN_TOP = 4;
var INLINE_IMAGE_MARGIN_TOP = 4;
var ROMAN_HEADER_MARGIN_TOP = 10;
var BLOCK_TITLE_MARGIN_TOP = 8;
var INLINE_IMAGE_MAX_LINES = 8;
var INLINE_IMAGE_MAX_CHARS = 900;
var shouldInlineImage = (lines) => {
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  return lines.length <= INLINE_IMAGE_MAX_LINES && totalChars <= INLINE_IMAGE_MAX_CHARS;
};
var styles3 = StyleSheet3.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette3.text,
    lineHeight: 1.55,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette3.border,
    borderRadius: 12,
    backgroundColor: "#ffffff"
  },
  brandLogo: {
    width: 52,
    height: 52,
    objectFit: "contain",
    borderRadius: 10,
    marginRight: 12
  },
  titleGroup: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 19,
    fontWeight: 700,
    color: palette3.text
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  pillBox: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    alignSelf: "flex-start",
    justifyContent: "center",
    backgroundColor: palette3.primaryMuted
  },
  pillText: {
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1,
    color: palette3.primary
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8
  },
  rootTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 10
  },
  romanHeader: {
    fontSize: 8,
    color: palette3.muted,
    textTransform: "uppercase",
    marginTop: ROMAN_HEADER_MARGIN_TOP,
    marginBottom: 4
  },
  blockTitle: {
    fontSize: 9,
    fontWeight: 700,
    marginTop: BLOCK_TITLE_MARGIN_TOP,
    marginBottom: 4
  },
  inlineHeading: {
    marginTop: 0
  },
  paragraph: {
    fontSize: 9,
    marginBottom: 8,
    lineHeight: 1.55
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: palette3.text,
    marginTop: 5,
    marginRight: 6
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.55
  },
  justifiedText: {
    textAlign: "justify"
  },
  inlineLink: {
    color: palette3.primary,
    textDecoration: "underline"
  },
  divider: {
    height: 1,
    backgroundColor: palette3.border,
    marginVertical: 12
  },
  // Image styles (no crop, no stretch)
  figureCaption: {
    marginTop: 6,
    fontSize: 7,
    color: palette3.muted,
    textAlign: "center",
    lineHeight: 1.2
  },
  // Single image (centered)
  singleFigure: {
    marginTop: 10,
    marginBottom: 14,
    alignItems: "center"
  },
  singleBox: {
    width: "72%",
    borderWidth: 1,
    borderColor: palette3.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: palette3.soft
  },
  singleImage: {
    width: "100%",
    height: 260,
    objectFit: "contain"
    // ✅ keeps full photo, no cropping
  },
  // Grid (2 columns)
  grid: {
    marginTop: 10,
    marginBottom: 14
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  gridRowSingle: {
    justifyContent: "center"
  },
  gridCell: {
    width: "48%"
  },
  gridCellSingle: {
    width: "72%"
    // if odd last row -> centered larger cell
  },
  gridBox: {
    borderWidth: 1,
    borderColor: palette3.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: palette3.soft
  },
  gridImage: {
    width: "100%",
    height: 190,
    objectFit: "contain"
    // ✅ no cropping
  },
  inlineMediaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: INLINE_ROW_MARGIN_TOP,
    marginBottom: 4
  },
  inlineTextCol: {
    flexGrow: 1,
    flexBasis: 0,
    marginRight: 12
  },
  inlineImageCol: {
    width: "36%",
    marginTop: INLINE_IMAGE_MARGIN_TOP
  },
  inlineImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    objectFit: "cover"
  },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette3.muted,
    // ou palette.primary si tu veux bleu
    textDecoration: "none"
    // pas souligné
  }
});
var citeCtx = { map: /* @__PURE__ */ new Map(), next: 1 };
var citeNumber2 = (url) => {
  const u = url.trim();
  const existing = citeCtx.map.get(u);
  if (existing) return existing;
  const n = citeCtx.next++;
  citeCtx.map.set(u, n);
  return n;
};
var normalizeTextLines = (val) => {
  if (val === null || val === void 0) return [];
  if (Array.isArray(val)) {
    return val.map((v) => v === null || v === void 0 ? "" : String(v)).map((v) => v.trim()).filter(Boolean);
  }
  return String(val).split(/\n+/).map((v) => v.trim()).filter(Boolean);
};
var IMG_MD = /^!\[([^\]]*)\]\(((?:https?:\/\/|data:)[^\s)]+)\)\s*$/i;
var BULLET_RE = /^\s*[-*•]\s+(.*)$/;
var LINK_ANY2 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations2 = (raw) => {
  LINK_ANY2.lastIndex = 0;
  const rawText = raw ?? "";
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY2.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber2(url);
      out.push(
        /* @__PURE__ */ jsxs3(Link2, { src: url, style: styles3.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var looksLikeRomanHeader = (line) => /^\(\s*[ivx]+\s*\)\s+/i.test(line);
var renderMixedLines = (lines) => {
  const nodes = [];
  let pendingImgs = [];
  const flushImgs = (keyBase) => {
    if (!pendingImgs.length) return;
    nodes.push(
      /* @__PURE__ */ jsx4(
        ImageBlock,
        {
          images: pendingImgs,
          styles: styles3,
          renderCaption: renderInlineCitations2
        },
        `imgblk-${keyBase}-${nodes.length}`
      )
    );
    pendingImgs = [];
  };
  lines.forEach((line, idx) => {
    const img = IMG_MD.exec(line);
    if (img) {
      const caption = (img[1] || "").trim();
      const src = img[2];
      pendingImgs.push({ src, caption: caption || void 0 });
      return;
    }
    flushImgs(String(idx));
    if (looksLikeRomanHeader(line)) {
      nodes.push(
        /* @__PURE__ */ jsx4(Text4, { style: styles3.romanHeader, minPresenceAhead: 60, children: renderInlineCitations2(line) }, `rh-${idx}`)
      );
      return;
    }
    const bulletMatch = line.match(BULLET_RE);
    if (bulletMatch) {
      nodes.push(
        /* @__PURE__ */ jsxs3(View4, { style: styles3.bulletRow, children: [
          /* @__PURE__ */ jsx4(View4, { style: styles3.bulletDot }),
          /* @__PURE__ */ jsx4(Text4, { style: [styles3.bulletText, styles3.justifiedText], wrap: true, children: renderInlineCitations2(bulletMatch[1].trim()) })
        ] }, `b-${idx}`)
      );
      return;
    }
    nodes.push(
      /* @__PURE__ */ jsx4(Text4, { style: [styles3.paragraph, styles3.justifiedText], wrap: true, children: renderInlineCitations2(line) }, `p-${idx}`)
    );
  });
  flushImgs("end");
  return nodes;
};
var PresentationPdfDocument = ({
  content
}) => {
  const contentObj = content || {};
  const structuredSections = Array.isArray(contentObj?.sections) ? contentObj.sections : null;
  const rootTitle = contentObj?.rootTitle;
  const descCandidate = contentObj?.presentation || contentObj?.presentation_entreprise || contentObj?.Presentation || contentObj?.PresentationEntreprise || contentObj?.Description?.description || contentObj?.description || (typeof content === "string" ? content : null);
  const fallbackBlocks = !descCandidate && content && typeof content === "object" ? Object.entries(contentObj).filter(([k]) => !/source/i.test(k)) : [];
  return /* @__PURE__ */ jsx4(Document2, { children: /* @__PURE__ */ jsxs3(Page2, { size: "A4", style: styles3.page, wrap: true, children: [
    /* @__PURE__ */ jsx4(SectionNav_default, { active: "Pr\xE9sentation" }),
    /* @__PURE__ */ jsx4(Text4, { style: styles3.sectionTitle, children: "Pr\xE9sentation" }),
    rootTitle ? /* @__PURE__ */ jsx4(Text4, { style: styles3.rootTitle, children: renderInlineCitations2(String(rootTitle)) }) : null,
    structuredSections && structuredSections.length > 0 ? /* @__PURE__ */ jsx4(View4, { children: structuredSections.map((sec, idx) => {
      const subsections = Array.isArray(sec.subsections) ? sec.subsections : [];
      const firstSub = subsections[0];
      const firstImgs = normalizeImages(firstSub?.images);
      const firstTextLines = firstSub?.text ? normalizeTextLines(firstSub.text) : [];
      const firstHasMarkdownImgs = firstTextLines.some((line) => IMG_MD.test(line));
      const firstCanInlineImage = firstTextLines.length > 0 && firstImgs.length === 1 && !firstHasMarkdownImgs && shouldInlineImage(firstTextLines);
      const inlineSectionTitle = Boolean(sec.title) && firstCanInlineImage;
      return /* @__PURE__ */ jsxs3(View4, { children: [
        !inlineSectionTitle && sec.title ? /* @__PURE__ */ jsx4(Text4, { style: styles3.romanHeader, minPresenceAhead: 80, children: renderInlineCitations2(String(sec.title)) }) : null,
        subsections.map((sub, subIdx) => {
          const structuredImgs = normalizeImages(sub?.images);
          const textLines = sub.text ? normalizeTextLines(sub.text) : [];
          const hasMarkdownImgs = textLines.some((line) => IMG_MD.test(line));
          const canInlineImage = textLines.length > 0 && structuredImgs.length === 1 && !hasMarkdownImgs && shouldInlineImage(textLines);
          const includeSectionTitle = inlineSectionTitle && subIdx === 0;
          const headingMarginTop = includeSectionTitle ? ROMAN_HEADER_MARGIN_TOP : sub.subtitle ? BLOCK_TITLE_MARGIN_TOP : INLINE_ROW_MARGIN_TOP;
          const inlineRowStyle = [
            styles3.inlineMediaRow,
            { marginTop: headingMarginTop }
          ];
          const inlineImageColStyle = includeSectionTitle || sub.subtitle ? [styles3.inlineImageCol, { marginTop: 0 }] : styles3.inlineImageCol;
          return /* @__PURE__ */ jsx4(View4, { style: { marginBottom: 8 }, children: canInlineImage ? /* @__PURE__ */ jsx4(Fragment, { children: /* @__PURE__ */ jsxs3(View4, { style: inlineRowStyle, wrap: false, children: [
            /* @__PURE__ */ jsxs3(View4, { style: styles3.inlineTextCol, children: [
              includeSectionTitle ? /* @__PURE__ */ jsx4(
                Text4,
                {
                  style: [styles3.romanHeader, styles3.inlineHeading],
                  minPresenceAhead: 80,
                  children: renderInlineCitations2(String(sec.title))
                }
              ) : null,
              sub.subtitle ? /* @__PURE__ */ jsx4(
                Text4,
                {
                  style: [
                    styles3.blockTitle,
                    includeSectionTitle ? null : styles3.inlineHeading
                  ],
                  minPresenceAhead: 60,
                  children: renderInlineCitations2(String(sub.subtitle))
                }
              ) : null,
              renderMixedLines(textLines)
            ] }),
            /* @__PURE__ */ jsxs3(View4, { style: inlineImageColStyle, wrap: false, children: [
              /* @__PURE__ */ jsx4(Image3, { src: structuredImgs[0].src, style: styles3.inlineImage }),
              structuredImgs[0].caption ? /* @__PURE__ */ jsx4(Text4, { style: styles3.figureCaption, children: renderInlineCitations2(structuredImgs[0].caption) }) : null
            ] })
          ] }) }) : /* @__PURE__ */ jsxs3(Fragment, { children: [
            sub.subtitle ? /* @__PURE__ */ jsx4(Text4, { style: styles3.blockTitle, minPresenceAhead: 60, children: renderInlineCitations2(String(sub.subtitle)) }) : null,
            sub.text ? renderMixedLines(textLines) : null,
            structuredImgs.length ? /* @__PURE__ */ jsx4(
              ImageBlock,
              {
                images: structuredImgs,
                styles: styles3,
                renderCaption: renderInlineCitations2
              }
            ) : null
          ] }) }, `sub-${idx}-${subIdx}`);
        }),
        idx < structuredSections.length - 1 ? /* @__PURE__ */ jsx4(View4, { style: styles3.divider }) : null
      ] }, `sec-${idx}`);
    }) }) : descCandidate ? /* @__PURE__ */ jsx4(View4, { children: renderMixedLines(normalizeTextLines(descCandidate)) }) : /* @__PURE__ */ jsx4(View4, { children: fallbackBlocks.map(([key, val], idx) => /* @__PURE__ */ jsxs3(View4, { style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ jsx4(Text4, { style: styles3.romanHeader, minPresenceAhead: 60, children: renderInlineCitations2(String(key)) }),
      renderMixedLines(normalizeTextLines(val))
    ] }, `fb-${key}-${idx}`)) })
  ] }) });
};
var TwoPagerPresentationPdfDocument_default = PresentationPdfDocument;

// src/two-pager/pdf/actionnariat/ActionnariatPdfDocument.tsx
import { Document as Document3, Page as Page3, Text as Text5, View as View5, StyleSheet as StyleSheet4, Link as Link3 } from "@react-pdf/renderer";

// src/two-pager/utils/orbis.ts
var isRecord = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));
var toNullableString = (value) => {
  if (value === null || value === void 0) return null;
  const text = String(value).trim();
  return text ? text : null;
};
var toNullableNumber = (value) => {
  if (value === null || value === void 0 || value === "") return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};
var toRecordArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord);
};
var compareDatesDesc = (left, right) => {
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;
  const leftTimestamp = Date.parse(left);
  const rightTimestamp = Date.parse(right);
  if (Number.isNaN(leftTimestamp) || Number.isNaN(rightTimestamp)) {
    return right.localeCompare(left);
  }
  return rightTimestamp - leftTimestamp;
};
function hasOrbisData(data) {
  return Boolean(
    data && (data.companyName || data.bvdIdNumber || data.shareholders.length || data.subsidiaries.length || data.financials.length)
  );
}
function extractOrbisData(content) {
  const root = isRecord(content) ? content : null;
  const mergedEntries = toRecordArray(root?.merged);
  const directEntries = mergedEntries.length ? mergedEntries : root ? [root] : [];
  let companyName = null;
  let bvdIdNumber = null;
  const shareholders = [];
  const subsidiaries = [];
  const financials = [];
  directEntries.forEach((entry) => {
    if (!companyName) companyName = toNullableString(entry.company_name);
    if (!bvdIdNumber) bvdIdNumber = toNullableString(entry.bvd_id_number);
    toRecordArray(entry.shareholders).forEach((row) => {
      shareholders.push({
        name: toNullableString(row.SH_NAME),
        directPct: toNullableString(row.SH_DIRECT_PCT),
        informationDate: toNullableString(row.SH_INFORMATION_DATE)
      });
    });
    toRecordArray(entry.subsidiaries).forEach((row) => {
      subsidiaries.push({
        name: toNullableString(row.SUB_NAME),
        directPct: toNullableString(row.SUB_DIRECT_PCT),
        informationDate: toNullableString(row.SUB_INFORMATION_DATE)
      });
    });
    toRecordArray(entry.financials).forEach((row) => {
      financials.push({
        revenue: toNullableNumber(row.revenue),
        cashFlow: toNullableNumber(row.cash_flow),
        employees: toNullableNumber(row.employees),
        netIncome: toNullableNumber(row.net_income),
        closingDate: toNullableString(row.closing_date),
        totalAssets: toNullableNumber(row.total_assets),
        shareholdersFunds: toNullableNumber(row.shareholders_funds)
      });
    });
  });
  const normalized = {
    companyName,
    bvdIdNumber,
    shareholders,
    subsidiaries,
    financials: [...financials].sort(
      (left, right) => compareDatesDesc(left.closingDate, right.closingDate)
    )
  };
  return hasOrbisData(normalized) ? normalized : null;
}

// src/two-pager/pdf/actionnariat/ActionnariatPdfDocument.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var palette4 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  badgeBg: "#E0F2FE",
  badgeText: "#0F172A"
};
var styles4 = StyleSheet4.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette4.text,
    lineHeight: 1.45,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette4.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: palette4.text
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette4.primaryMuted,
    color: palette4.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  section: {
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8
  },
  subSectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    marginBottom: 6,
    color: palette4.text
  },
  card: {
    borderWidth: 1,
    borderColor: palette4.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff"
  },
  actionCard: {
    borderWidth: 1,
    borderColor: palette4.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F8FAFC",
    marginBottom: 8
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 4
  },
  actionText: {
    fontSize: 8.5,
    color: palette4.text
  },
  timeline: {
    borderLeftWidth: 1,
    borderLeftColor: palette4.border,
    paddingLeft: 10
  },
  timelineItem: {
    marginBottom: 12
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette4.primary,
    marginRight: 8
  },
  timelineDate: {
    fontSize: 9,
    fontWeight: 700,
    marginRight: 8
  },
  badge: {
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: palette4.primaryMuted,
    color: palette4.primary
  },
  timelineBody: {
    fontSize: 8.5,
    color: palette4.text,
    marginLeft: 16
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderTopWidth: 1,
    borderTopColor: palette4.border,
    borderBottomWidth: 1,
    borderBottomColor: palette4.border
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette4.border
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    color: palette4.text
  },
  td: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    color: palette4.text
  },
  colConseil: { width: "25%" },
  colCategorie: { width: "20%" },
  colAcc: { width: "20%" },
  colEquipe: { width: "35%" },
  colEntity: { width: "52%" },
  colPct: { width: "20%" },
  colInfoDate: { width: "28%" },
  colFinancialDate: { width: "18%" },
  colFinancialMetric: { width: "16.4%" },
  muted: {
    color: palette4.muted
  },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette4.muted,
    textDecoration: "none"
  }
});
var createCiteCtx2 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber3 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY3 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations3 = (raw, ctx) => {
  LINK_ANY3.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY3.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber3(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs4(Link3, { src: url, style: styles4.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var formatOrbisDisplayDate = (value) => {
  if (!value) return "\u2014";
  if (/^\d{2}\/\d{4}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("fr-FR");
};
var formatOrbisNumber = (value) => {
  if (value === null || value === void 0 || !Number.isFinite(value)) return "\u2014";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);
};
var ActionnariatPdfDocument = ({
  actions = [],
  ops = [],
  advisors = [],
  orbisData
}) => {
  const cleanActions = Array.isArray(actions) ? actions : [];
  const cleanOps = Array.isArray(ops) ? ops : [];
  const cleanAdvisors = Array.isArray(advisors) ? advisors : [];
  const citeCtx2 = createCiteCtx2();
  return /* @__PURE__ */ jsx5(Document3, { children: /* @__PURE__ */ jsxs4(Page3, { size: "A4", style: styles4.page, children: [
    /* @__PURE__ */ jsx5(SectionNav_default, { active: "Actionnariat" }),
    /* @__PURE__ */ jsxs4(View5, { style: styles4.section, children: [
      /* @__PURE__ */ jsx5(Text5, { style: styles4.sectionTitle, children: "Actionnariat actuel" }),
      cleanActions.length ? cleanActions.map((a, idx) => {
        const description = String(a.description || a.commentaire || "").trim();
        return /* @__PURE__ */ jsxs4(View5, { style: styles4.actionCard, wrap: false, children: [
          /* @__PURE__ */ jsx5(Text5, { style: styles4.actionTitle, children: renderInlineCitations3(a.nom_actionnaire || "Actionnaire", citeCtx2) }),
          a.participation && /* @__PURE__ */ jsx5(Text5, { style: [styles4.actionText, { marginBottom: 4 }], children: renderInlineCitations3(a.participation, citeCtx2) }),
          description ? /* @__PURE__ */ jsx5(Text5, { style: styles4.actionText, children: renderInlineCitations3(description, citeCtx2) }) : null
        ] }, `act-${idx}`);
      }) : /* @__PURE__ */ jsx5(Text5, { style: styles4.muted, children: "Aucun actionnaire renseign\xE9." })
    ] }),
    /* @__PURE__ */ jsxs4(View5, { style: styles4.section, children: [
      /* @__PURE__ */ jsx5(Text5, { style: styles4.sectionTitle, children: "Principales op\xE9rations capitalistiques" }),
      cleanOps.length ? /* @__PURE__ */ jsx5(View5, { style: styles4.timeline, children: cleanOps.map((o, idx) => /* @__PURE__ */ jsxs4(View5, { style: styles4.timelineItem, wrap: false, children: [
        /* @__PURE__ */ jsxs4(View5, { style: styles4.timelineHeader, children: [
          /* @__PURE__ */ jsx5(View5, { style: styles4.dot }),
          /* @__PURE__ */ jsx5(Text5, { style: styles4.timelineDate, children: renderInlineCitations3(o.date || o.year || "\u2014", citeCtx2) }),
          o.type_operation && /* @__PURE__ */ jsx5(Text5, { style: styles4.badge, children: renderInlineCitations3(o.type_operation, citeCtx2) })
        ] }),
        /* @__PURE__ */ jsx5(Text5, { style: styles4.timelineBody, children: renderInlineCitations3(o.operation || o.description || "\u2014", citeCtx2) }),
        (o.source || o.sources) && /* @__PURE__ */ jsxs4(Text5, { style: [styles4.timelineBody, { marginTop: 4, color: palette4.muted }], children: [
          "Source:",
          " ",
          renderInlineCitations3(
            Array.isArray(o.source || o.sources) ? (o.source || o.sources).join(", ") : o.source || o.sources,
            citeCtx2
          )
        ] })
      ] }, `op-${idx}`)) }) : /* @__PURE__ */ jsx5(Text5, { style: styles4.muted, children: "Aucune op\xE9ration renseign\xE9e." })
    ] }),
    hasOrbisData(orbisData) && /* @__PURE__ */ jsx5(View5, { style: styles4.section, children: /* @__PURE__ */ jsxs4(View5, { style: styles4.card, children: [
      orbisData?.shareholders.length ? /* @__PURE__ */ jsxs4(View5, { style: styles4.section, children: [
        /* @__PURE__ */ jsx5(Text5, { style: styles4.subSectionTitle, children: "Actionnaires Orbis" }),
        /* @__PURE__ */ jsxs4(View5, { children: [
          /* @__PURE__ */ jsxs4(View5, { style: styles4.tableHeader, children: [
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colEntity], children: "Actionnaire" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colPct], children: "% direct" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colInfoDate], children: "Date info" })
          ] }),
          orbisData.shareholders.map((shareholder, idx) => /* @__PURE__ */ jsxs4(View5, { style: styles4.tableRow, children: [
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colEntity], children: sanitizePdfText(shareholder.name || "\u2014") }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colPct], children: sanitizePdfText(
              shareholder.directPct ? `${shareholder.directPct}%` : "\u2014"
            ) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colInfoDate], children: sanitizePdfText(
              formatOrbisDisplayDate(shareholder.informationDate)
            ) })
          ] }, `orbis-sh-${idx}`))
        ] })
      ] }) : null,
      orbisData?.subsidiaries.length ? /* @__PURE__ */ jsxs4(View5, { style: styles4.section, children: [
        /* @__PURE__ */ jsx5(Text5, { style: styles4.subSectionTitle, children: "Filiales Orbis" }),
        /* @__PURE__ */ jsxs4(View5, { children: [
          /* @__PURE__ */ jsxs4(View5, { style: styles4.tableHeader, children: [
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colEntity], children: "Filiale" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colPct], children: "% direct" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colInfoDate], children: "Date info" })
          ] }),
          orbisData.subsidiaries.map((subsidiary, idx) => /* @__PURE__ */ jsxs4(View5, { style: styles4.tableRow, children: [
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colEntity], children: sanitizePdfText(subsidiary.name || "\u2014") }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colPct], children: sanitizePdfText(
              subsidiary.directPct ? `${subsidiary.directPct}%` : "\u2014"
            ) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colInfoDate], children: sanitizePdfText(
              formatOrbisDisplayDate(subsidiary.informationDate)
            ) })
          ] }, `orbis-sub-${idx}`))
        ] })
      ] }) : null,
      orbisData?.financials.length ? /* @__PURE__ */ jsxs4(View5, { style: styles4.section, children: [
        /* @__PURE__ */ jsx5(Text5, { style: styles4.subSectionTitle, children: "Financiers Orbis" }),
        /* @__PURE__ */ jsxs4(View5, { children: [
          /* @__PURE__ */ jsxs4(View5, { style: styles4.tableHeader, children: [
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colFinancialDate], children: "Cl\xF4ture" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colFinancialMetric], children: "Revenue" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colFinancialMetric], children: "Net income" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colFinancialMetric], children: "Cash flow" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colFinancialMetric], children: "Assets" }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.th, styles4.colFinancialMetric], children: "Equity" })
          ] }),
          orbisData.financials.map((financial, idx) => /* @__PURE__ */ jsxs4(View5, { style: styles4.tableRow, children: [
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colFinancialDate], children: sanitizePdfText(formatOrbisDisplayDate(financial.closingDate)) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colFinancialMetric], children: sanitizePdfText(formatOrbisNumber(financial.revenue)) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colFinancialMetric], children: sanitizePdfText(formatOrbisNumber(financial.netIncome)) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colFinancialMetric], children: sanitizePdfText(formatOrbisNumber(financial.cashFlow)) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colFinancialMetric], children: sanitizePdfText(formatOrbisNumber(financial.totalAssets)) }),
            /* @__PURE__ */ jsx5(Text5, { style: [styles4.td, styles4.colFinancialMetric], children: sanitizePdfText(formatOrbisNumber(financial.shareholdersFunds)) })
          ] }, `orbis-fin-${idx}`))
        ] })
      ] }) : null
    ] }) })
  ] }) });
};
var ActionnariatPdfDocument_default = ActionnariatPdfDocument;

// src/two-pager/pdf/management/ManagementPdfDocument.tsx
import { Document as Document4, Page as Page4, Text as Text6, View as View6, StyleSheet as StyleSheet5, Link as Link4 } from "@react-pdf/renderer";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var palette5 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280"
};
var styles5 = StyleSheet5.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette5.text,
    lineHeight: 1.45,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette5.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: palette5.text
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette5.primaryMuted,
    color: palette5.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  pageTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10
  },
  table: {
    borderWidth: 1,
    borderColor: palette5.border,
    borderRadius: 10,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: palette5.border
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette5.border
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    color: palette5.text
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8,
    color: palette5.text,
    lineHeight: 1.4
  },
  colNom: { width: "28%" },
  colLinkedin: { width: "12%" },
  colBio: { width: "60%" },
  name: {
    fontSize: 9,
    fontWeight: 700
  },
  role: {
    fontSize: 8,
    color: palette5.muted,
    marginTop: 2
  },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette5.muted,
    textDecoration: "none"
  },
  muted: { color: palette5.muted }
});
var pickText = (...vals) => vals.map((v) => (v || "").toString().trim()).filter(Boolean)[0] || "\u2014";
var createCiteCtx3 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber4 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY4 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations4 = (raw, ctx) => {
  LINK_ANY4.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY4.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber4(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs5(Link4, { src: url, style: styles5.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var ManagementPdfDocument = ({
  managers = []
}) => {
  const rows = Array.isArray(managers) ? managers : [];
  const citeCtx2 = createCiteCtx3();
  return /* @__PURE__ */ jsx6(Document4, { children: /* @__PURE__ */ jsxs5(Page4, { size: "A4", style: styles5.page, children: [
    /* @__PURE__ */ jsx6(SectionNav_default, { active: "Management" }),
    /* @__PURE__ */ jsx6(Text6, { style: styles5.pageTitle, children: "Management" }),
    /* @__PURE__ */ jsxs5(View6, { style: styles5.table, children: [
      /* @__PURE__ */ jsxs5(View6, { style: styles5.tableHeader, children: [
        /* @__PURE__ */ jsx6(Text6, { style: [styles5.th, styles5.colNom], children: "Nom" }),
        /* @__PURE__ */ jsx6(Text6, { style: [styles5.th, styles5.colLinkedin], children: "LinkedIn" }),
        /* @__PURE__ */ jsx6(Text6, { style: [styles5.th, styles5.colBio], children: "Bio" })
      ] }),
      rows.length ? rows.map((m, idx) => /* @__PURE__ */ jsxs5(View6, { style: styles5.tableRow, wrap: false, children: [
        /* @__PURE__ */ jsxs5(Text6, { style: [styles5.td, styles5.colNom], children: [
          /* @__PURE__ */ jsx6(Text6, { style: styles5.name, children: renderInlineCitations4(pickText(m.nom_prenom), citeCtx2) }),
          "\n",
          /* @__PURE__ */ jsx6(Text6, { style: styles5.role, children: renderInlineCitations4(pickText(m.role, m.poste, m.position), citeCtx2) })
        ] }),
        /* @__PURE__ */ jsx6(Text6, { style: [styles5.td, styles5.colLinkedin], children: m.profil_url ? renderInlineCitations4(m.profil_url, citeCtx2) : /* @__PURE__ */ jsx6(Text6, { style: styles5.muted, children: "\u2014" }) }),
        /* @__PURE__ */ jsx6(Text6, { style: [styles5.td, styles5.colBio], children: renderInlineCitations4(
          pickText(m.paragraphe_introduction, m.description, m.commentaire),
          citeCtx2
        ) })
      ] }, `mgr-${idx}`)) : /* @__PURE__ */ jsx6(View6, { style: styles5.tableRow, children: /* @__PURE__ */ jsx6(Text6, { style: [styles5.td, { width: "100%", textAlign: "center" }], children: "Aucun manager renseign\xE9." }) })
    ] })
  ] }) });
};
var ManagementPdfDocument_default = ManagementPdfDocument;

// src/two-pager/pdf/market/MarketPdfDocument.tsx
import React2 from "react";
import {
  Document as Document5,
  Page as Page5,
  Text as Text7,
  View as View7,
  StyleSheet as StyleSheet6,
  Image as Image4,
  Link as Link5,
  Svg,
  Path,
  G,
  Line,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop
} from "@react-pdf/renderer";

// src/two-pager/utils/asset.ts
var normalizeAssetUrl = (input) => {
  try {
    let url;
    try {
      url = new URL(input);
    } catch {
      if (typeof window === "undefined") return input;
      url = new URL(input, window.location.origin);
    }
    const isS3 = /amazonaws\.com$/i.test(url.hostname);
    if (isS3) {
      url.pathname = url.pathname.split("/").map((seg) => encodeURIComponent(decodeURIComponent(seg.replace(/\+/g, " ")))).join("/");
    }
    return url.toString();
  } catch {
    return input;
  }
};

// src/two-pager/pdf/market/MarketPdfDocument.tsx
import { Fragment as Fragment2, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var palette6 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  soft: "#F8FAFC"
};
var EM_ACCENT = "#2e5f7f";
var EM_ACCENT_LIGHT = "#DFE9F6";
var A4_WIDTH = 595.28;
var A4_HEIGHT = 841.89;
var PAGE_PAD_X = 48;
var PAGE_PAD_TOP = 96;
var PAGE_PAD_BOTTOM = 48;
var CONTENT_W = A4_WIDTH - PAGE_PAD_X * 2;
var CONTENT_H = A4_HEIGHT - PAGE_PAD_TOP - PAGE_PAD_BOTTOM;
var INLINE_ROW_MARGIN_TOP2 = 4;
var INLINE_IMAGE_MARGIN_TOP2 = 4;
var H2_MARGIN_TOP = 10;
var SUBTITLE_MARGIN_TOP = 6;
var styles6 = StyleSheet6.create({
  page: {
    padding: PAGE_PAD_X,
    paddingTop: PAGE_PAD_TOP,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette6.text,
    lineHeight: 1.55,
    backgroundColor: "#ffffff"
  },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette6.muted,
    // ou palette.primary si tu veux bleu
    textDecoration: "none"
    // pas souligné
  },
  // Header (with logo)
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette6.border,
    borderRadius: 12,
    backgroundColor: "#ffffff"
  },
  brandLogo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 12,
    objectFit: "contain"
  },
  titleGroup: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 19,
    fontWeight: 700,
    color: palette6.text
  },
  // Typography
  h1: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10
  },
  h2: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: H2_MARGIN_TOP,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 8,
    color: palette6.muted,
    textTransform: "uppercase",
    marginTop: SUBTITLE_MARGIN_TOP,
    marginBottom: 4
  },
  inlineHeading: {
    marginTop: 0
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.55,
    marginBottom: 8
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: palette6.text,
    marginTop: 5,
    marginRight: 6
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.55
  },
  justifiedText: {
    textAlign: "justify"
  },
  inlineLink: {
    color: palette6.primary,
    textDecoration: "underline"
  },
  divider: {
    height: 1,
    backgroundColor: palette6.border,
    marginVertical: 12
  },
  // Image styles (no crop, no stretch)
  figureCaption: {
    marginTop: 6,
    fontSize: 7,
    color: palette6.muted,
    textAlign: "center",
    lineHeight: 1.2
  },
  // Single image (centered)
  singleFigure: {
    marginTop: 10,
    marginBottom: 14,
    alignItems: "center"
  },
  singleBox: {
    width: "72%",
    borderWidth: 1,
    borderColor: palette6.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: palette6.soft
  },
  singleImage: {
    width: "100%",
    height: 260,
    objectFit: "contain"
    // ✅ keeps full photo, no cropping
  },
  // Grid (2 columns)
  grid: {
    marginTop: 10,
    marginBottom: 14
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  gridRowSingle: {
    justifyContent: "center"
  },
  gridCell: {
    width: "48%"
  },
  gridCellSingle: {
    width: "72%"
    // if odd last row -> centered larger cell
  },
  gridBox: {
    borderWidth: 1,
    borderColor: palette6.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: palette6.soft
  },
  gridImage: {
    width: "100%",
    height: 190,
    objectFit: "contain"
    // ✅ no cropping
  },
  inlineMediaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: INLINE_ROW_MARGIN_TOP2,
    marginBottom: 4
  },
  inlineTextCol: {
    flexGrow: 1,
    flexBasis: 0,
    marginRight: 12
  },
  inlineImageCol: {
    width: "36%",
    marginTop: INLINE_IMAGE_MARGIN_TOP2
  },
  inlineImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    objectFit: "cover"
  },
  // Inline chart styles (similar to image but with fixed width for charts)
  inlineChartCol: {
    width: 200,
    // Fixed width to accommodate 190pt compact charts
    marginTop: INLINE_IMAGE_MARGIN_TOP2,
    marginLeft: 8
  },
  inlineChartTextCol: {
    flex: 1,
    marginRight: 8
  },
  // Sources
  sourcesTitle: {
    fontSize: 9,
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 8
  },
  sourceItem: {
    fontSize: 8,
    marginBottom: 4,
    color: palette6.primary
  },
  // --- VALUE CHAIN (PDF) ---
  vcWrap: {
    marginTop: 8
  },
  vcIntroLine: {
    fontSize: 8,
    lineHeight: 1.3,
    marginBottom: 4
  },
  vcCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: 6
  },
  vcCard: {
    borderWidth: 1,
    borderColor: "#2f5d78",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 8,
    position: "relative",
    minHeight: 170,
    overflow: "hidden"
  },
  vcCardHeader: {
    height: 24,
    borderRadius: 10,
    marginLeft: -8,
    marginRight: -8,
    marginTop: -8,
    marginBottom: 6,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  vcCardTitle: {
    fontSize: 8,
    fontWeight: 800,
    textAlign: "center",
    lineHeight: 1.1,
    paddingHorizontal: 8
  },
  vcCardBodyLine: {
    fontSize: 8,
    lineHeight: 1.25,
    marginBottom: 4
  },
  vcBulletRow: {
    flexDirection: "row",
    marginBottom: 4
  },
  vcBulletSquare: {
    width: 4,
    height: 4,
    marginRight: 5,
    marginTop: 2
  },
  vcBreadcrumbWrap: {
    marginTop: 6,
    marginBottom: 6,
    paddingTop: 4
  },
  vcBreadcrumbRow: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  vcCrumb: {
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    position: "relative"
  },
  vcCrumbLabel: {
    fontSize: 8,
    fontWeight: 800,
    lineHeight: 1,
    textAlign: "center"
  },
  vcLegend: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  vcLegendItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  vcLegendSwatch: {
    width: 50,
    height: 14,
    borderRadius: 2,
    marginRight: 8
  },
  vcLegendLabel: {
    fontSize: 8,
    fontWeight: 700
  },
  // --- GROWTH DRIVERS (PDF) ---
  dfWrap: {
    marginTop: 10
  },
  dfRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 12
  },
  dfCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#2e5f7f",
    borderRadius: 14
  },
  dfLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  dfLeftIconWrap: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  dfLeftIcon: {
    width: 20,
    height: 20,
    objectFit: "contain"
  },
  dfDivider: {
    width: 1,
    backgroundColor: "#2e5f7f",
    borderRadius: 2,
    alignSelf: "stretch",
    marginHorizontal: 10
  },
  dfLeftTitle: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: 600,
    lineHeight: 1.15,
    color: palette6.text
  },
  dfArrowWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  dfMiddle: {
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: "relative"
  },
  dfBulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4
  },
  dfBulletSquare: {
    width: 3,
    height: 3,
    backgroundColor: "#4f8935",
    borderRadius: 1,
    marginRight: 8,
    marginTop: 3
  },
  dfBulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 500,
    color: palette6.text
  },
  // --- BARRIÈRES À L’ENTRÉE (PDF) ---
  bdWrap: {
    marginTop: 10
  },
  bdCore: {
    marginTop: 8,
    position: "relative"
  },
  bdLine: {
    position: "absolute",
    opacity: 0.7,
    borderRadius: 2,
    zIndex: 1
  },
  bdGrid: {
    position: "relative",
    zIndex: 2
  },
  bdRow: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  bdCell: {
    position: "relative"
  },
  bdHead: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -6,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3
  },
  bdBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  bdBadgeImg: {
    width: "70%",
    height: "70%",
    objectFit: "contain"
  },
  bdTitle: {
    flex: 1,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1,
    textAlign: "center",
    paddingHorizontal: 6
  },
  bdCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10
  },
  bdBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6
  },
  bdBulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 3
  },
  bdBulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.22,
    fontWeight: 500,
    color: palette6.text,
    textAlign: "left"
  },
  // --- MARKET ECOSYSTEM (PDF) ---
  meWrap: {
    marginTop: 10
  },
  meRoot: {
    position: "relative",
    width: CONTENT_W
  },
  meDivider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: CONTENT_W / 2 - 1,
    width: 2,
    backgroundColor: "#D2D2D2"
  },
  meGridRow: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  meColumnWrap: {
    backgroundColor: "#F5F8FB",
    borderWidth: 1,
    borderColor: "#E1E6EB",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  meHeader: {
    fontSize: 8,
    fontWeight: 800,
    color: palette6.text,
    marginBottom: 8
  },
  meCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    minHeight: 62
  },
  meTypeBox: {
    fontSize: 8,
    fontWeight: 700,
    color: palette6.text,
    lineHeight: 1.12,
    marginBottom: 6
  },
  meLogos: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between"
  },
  meLogoItem: {
    position: "relative",
    width: 64,
    height: 26,
    marginVertical: 2,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  meLogoImg: {
    width: 64,
    height: 26,
    objectFit: "contain"
  },
  meLogoLinkOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    color: "transparent",
    fontSize: 1,
    textDecoration: "none"
  },
  mePill: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 8,
    color: palette6.text,
    backgroundColor: "#FAFAFA"
  },
  // --- END MARKETS (PDF) ---
  emWrap: {
    marginTop: 10
  },
  emRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 14
  },
  // card root (banner + body + clients)
  emCard: {
    fontFamily: "Helvetica",
    color: palette6.text,
    flexDirection: "column",
    flexGrow: 0,
    alignSelf: "stretch"
  },
  // banner area
  emBannerWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: EM_ACCENT_LIGHT,
    borderRadius: 22,
    marginBottom: 10
  },
  emBannerTitle: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginRight: 10,
    color: "#0b0f19",
    fontWeight: 700,
    fontSize: 9,
    lineHeight: 1.25
  },
  // badge circle
  emBadge: {
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: EM_ACCENT,
    alignItems: "center",
    justifyContent: "center"
  },
  emBadgeImg: {
    width: "70%",
    height: "70%",
    objectFit: "contain"
  },
  // body
  emBody: {
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#B1C7D9",
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexGrow: 1
  },
  emDesc: {
    fontSize: 8,
    lineHeight: 1.35,
    color: palette6.text,
    textAlign: "justify"
  },
  emUseCase: {
    fontSize: 8,
    lineHeight: 1.35,
    color: palette6.text,
    textAlign: "justify"
  },
  // centered heading (lines + text)
  emHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 6
  },
  emHeadingDark: {
    marginTop: 2
  },
  emHeadingLine: {
    width: 46,
    height: 1.4,
    borderRadius: 1,
    backgroundColor: EM_ACCENT,
    opacity: 0.9
  },
  emHeadingText: {
    fontSize: 8,
    fontWeight: 800,
    marginHorizontal: 8
  },
  emHeadingTextAccent: {
    color: EM_ACCENT
  },
  emHeadingTextDark: {
    color: "#0b0f19"
  },
  // clients dashed box
  emClients: {
    marginTop: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: EM_ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff"
  },
  emClientsGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
  emClientCell: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  emClientLogo: {
    objectFit: "contain"
  },
  emClientText: {
    textAlign: "center",
    fontSize: 8,
    fontWeight: 700,
    color: "#334155",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#EDF4F9",
    borderWidth: 1,
    borderColor: "#D0E0EA"
  },
  // invisible clickable overlay (same trick as MarketEcosystem)
  emLinkOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    color: "transparent",
    fontSize: 1,
    textDecoration: "none"
  }
});
var clamp = (min, v, max) => Math.max(min, Math.min(max, v));
var extractStartYear = (label) => {
  if (typeof label === "number" && Number.isFinite(label)) return label;
  const m = String(label).match(/\d{4}/);
  return m ? parseInt(m[0], 10) : null;
};
var BarChartPdf = ({ graph, valueSuffix = "", compact = false }) => {
  const n = Math.min(graph.periode_annees.length, graph.valeurs_marche.length);
  if (n <= 0) return null;
  const years = graph.periode_annees.slice(0, n);
  const values = graph.valeurs_marche.slice(0, n);
  const vbWidth = 900;
  const vbHeight = 360;
  const width = compact ? 190 : 495;
  const height = width * (vbHeight / vbWidth);
  const scale = width / vbWidth;
  const margin = { top: 100, right: 60, bottom: 80, left: 60 };
  const baselineY = vbHeight - margin.bottom;
  const plotTop = margin.top;
  const plotHeight = baselineY - plotTop;
  const maxVal = Math.max(...values);
  const safeMax = maxVal > 0 ? maxVal : 1;
  const barMaxHeight = plotHeight * 0.88;
  const scaleY = barMaxHeight / safeMax;
  const step = (vbWidth - margin.left - margin.right) / n;
  const barWidth = step * 0.38;
  const centersX = years.map((_, i) => margin.left + step * (i + 0.5));
  const valueFont = clamp(11, step * 0.18, 23);
  const yearFont = clamp(11, step * 0.2, 23);
  const cagrFont = clamp(11, step * 0.16, 23);
  const baselineX1 = 20;
  const baselineX2 = vbWidth - 20;
  const startYears = years.map(extractStartYear);
  const hasGapAfter = (i) => {
    const a = startYears[i];
    const b = startYears[i + 1];
    return a != null && b != null && b - a > 1;
  };
  const cagrAvailable = !!graph.cagr && graph.cagr.disponible === true && Number.isFinite(graph.cagr.valeur) && n >= 2;
  const showArrow = cagrAvailable && n >= 2;
  const arrowX1 = baselineX1 + 60;
  const arrowX2 = baselineX2 - 60;
  const arrowY1 = 62;
  const arrowY2 = 30;
  const arrowAngle = Math.atan2(arrowY2 - arrowY1, arrowX2 - arrowX1);
  const arrowHeadLength = 14;
  const arrowHeadWidth = 7;
  const tipX = arrowX2;
  const tipY = arrowY2;
  const base1X = tipX - arrowHeadLength * Math.cos(arrowAngle) + arrowHeadWidth * Math.sin(arrowAngle);
  const base1Y = tipY - arrowHeadLength * Math.sin(arrowAngle) - arrowHeadWidth * Math.cos(arrowAngle);
  const base2X = tipX - arrowHeadLength * Math.cos(arrowAngle) - arrowHeadWidth * Math.sin(arrowAngle);
  const base2Y = tipY - arrowHeadLength * Math.sin(arrowAngle) + arrowHeadWidth * Math.cos(arrowAngle);
  const arrowHeadPath = `M ${tipX} ${tipY} L ${base1X} ${base1Y} L ${base2X} ${base2Y} Z`;
  const firstLabel = String(years[0]);
  const lastLabel = String(years[n - 1]);
  const cagrText = cagrAvailable ? `TCAM ${firstLabel} \u2013 ${lastLabel}: ${graph.cagr.valeur >= 0 ? "+" : ""}${graph.cagr.valeur.toFixed(1)}%` : "";
  const gradId = `barGrad-${Math.random().toString(36).substring(2, 11)}`;
  return /* @__PURE__ */ jsxs6(View7, { style: { marginVertical: 8, position: "relative" }, children: [
    /* @__PURE__ */ jsxs6(Svg, { width, height, viewBox: `0 0 ${vbWidth} ${vbHeight}`, children: [
      /* @__PURE__ */ jsx7(Defs, { children: /* @__PURE__ */ jsxs6(LinearGradient, { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx7(Stop, { offset: "0%", stopColor: "#1f2f42" }),
        /* @__PURE__ */ jsx7(Stop, { offset: "100%", stopColor: "#172636" })
      ] }) }),
      showArrow && /* @__PURE__ */ jsxs6(G, { children: [
        /* @__PURE__ */ jsx7(
          Line,
          {
            x1: arrowX1,
            y1: arrowY1,
            x2: arrowX2 - 12,
            y2: arrowY2 + 2,
            stroke: "#38B9BE",
            strokeWidth: 4
          }
        ),
        /* @__PURE__ */ jsx7(Path, { d: arrowHeadPath, fill: "#38B9BE" })
      ] }),
      /* @__PURE__ */ jsx7(
        Line,
        {
          x1: baselineX1,
          y1: baselineY,
          x2: baselineX2,
          y2: baselineY,
          stroke: "#7B7B7B",
          strokeWidth: 4
        }
      ),
      Array.from({ length: n - 1 }).map((_, i) => {
        if (!hasGapAfter(i)) return null;
        const xBreak = (centersX[i] + centersX[i + 1]) / 2;
        return /* @__PURE__ */ jsxs6(G, { children: [
          /* @__PURE__ */ jsx7(
            Line,
            {
              x1: xBreak - 10,
              y1: baselineY + 14,
              x2: xBreak - 2,
              y2: baselineY - 14,
              stroke: "#7B7B7B",
              strokeWidth: 4
            }
          ),
          /* @__PURE__ */ jsx7(
            Line,
            {
              x1: xBreak + 2,
              y1: baselineY + 14,
              x2: xBreak + 10,
              y2: baselineY - 14,
              stroke: "#7B7B7B",
              strokeWidth: 4
            }
          )
        ] }, `break-${i}`);
      }),
      values.map((v, i) => {
        const h = v * scaleY;
        const x = centersX[i] - barWidth / 2;
        const y = baselineY - h;
        return /* @__PURE__ */ jsx7(
          Rect,
          {
            x,
            y,
            width: barWidth,
            height: h,
            fill: `url(#${gradId})`,
            rx: 2
          },
          `bar-${i}`
        );
      })
    ] }),
    /* @__PURE__ */ jsxs6(View7, { style: { position: "absolute", top: 0, left: 0, width, height }, children: [
      showArrow && /* @__PURE__ */ jsx7(
        Text7,
        {
          style: {
            position: "absolute",
            left: (arrowX1 + arrowX2) / 2 * scale - 60,
            top: ((arrowY1 + arrowY2) / 2 - 18) * scale,
            fontSize: cagrFont * scale,
            fontWeight: 800,
            color: "#38B9BE",
            width: 120,
            textAlign: "center"
          },
          children: cagrText
        }
      ),
      values.map((v, i) => {
        const h = v * scaleY;
        const y = baselineY - h;
        const labelWidth = step * scale;
        return /* @__PURE__ */ jsxs6(React2.Fragment, { children: [
          /* @__PURE__ */ jsxs6(
            Text7,
            {
              style: {
                position: "absolute",
                left: centersX[i] * scale - labelWidth / 2,
                top: (y - 20) * scale,
                fontSize: valueFont * scale,
                fontWeight: 900,
                color: "#111",
                textAlign: "center",
                width: labelWidth
              },
              children: [
                v.toLocaleString("fr-FR", { maximumFractionDigits: 2 }),
                valueSuffix
              ]
            }
          ),
          /* @__PURE__ */ jsx7(
            Text7,
            {
              style: {
                position: "absolute",
                left: centersX[i] * scale - labelWidth / 2,
                top: (baselineY + 25) * scale,
                fontSize: yearFont * scale,
                fontWeight: 900,
                color: "#111",
                textAlign: "center",
                width: labelWidth
              },
              children: String(years[i])
            }
          )
        ] }, `label-${i}`);
      })
    ] }),
    graph.sous_titre_graph && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 8, color: "#717171", marginTop: 4, textAlign: "center" }, children: sanitizePdfText(graph.sous_titre_graph) })
  ] });
};
var MetricKpiPdf = ({ data, compact = false }) => {
  const numericValue = typeof data.value === "number" ? data.value : Number.parseFloat(String(data.value ?? ""));
  const formattedValue = Number.isFinite(numericValue) ? numericValue.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : String(data.value ?? "");
  const suffix = data.unit ? data.unit === "%" || data.unit.startsWith("%") ? data.unit : ` ${data.unit}` : "";
  const labelParts = [data.label, data.country].filter(Boolean);
  const label = labelParts.join(" - ");
  const valueFontSize = compact ? 14 : 24;
  const padding = compact ? 8 : 16;
  const titleFontSize = compact ? 7 : 9;
  const labelFontSize = compact ? 6 : 8;
  return /* @__PURE__ */ jsxs6(View7, { style: { marginVertical: compact ? 4 : 8 }, children: [
    data.title && !compact && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: titleFontSize, fontWeight: 600, marginBottom: 8, color: "#111827" }, children: sanitizePdfText(data.title) }),
    /* @__PURE__ */ jsxs6(
      View7,
      {
        style: {
          padding,
          backgroundColor: "#F8FAFC",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          alignItems: "center"
        },
        children: [
          /* @__PURE__ */ jsxs6(Text7, { style: { fontSize: valueFontSize, fontWeight: 900, color: "#1f2f42", marginBottom: compact ? 2 : 4 }, children: [
            formattedValue,
            suffix
          ] }),
          label && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: labelFontSize, color: "#6B7280", textAlign: "center" }, children: sanitizePdfText(label) })
        ]
      }
    ),
    data.subtitle && !compact && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 7, color: "#717171", marginTop: 4, textAlign: "center" }, children: sanitizePdfText(data.subtitle) })
  ] });
};
var PieChartPdf = ({ data, compact = false }) => {
  const n = Math.min(data.categories.length, data.values.length);
  if (n <= 0) return null;
  const categories = data.categories.slice(0, n);
  const values = data.values.slice(0, n).map((v) => Number.isFinite(v) ? Math.max(0, v) : 0);
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total <= 0) return null;
  const colors = ["#1f2f42", "#38B9BE", "#2E5F7F", "#7B7B7B", "#94A3B8", "#E2E8F0"];
  const vbSize = 240;
  const scale = compact ? 0.4 : 0.65;
  const size = vbSize * scale;
  const center = vbSize / 2;
  const radius = vbSize / 2 - 8;
  const innerRadius = radius * 0.58;
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = Math.PI / 180 * (angleDeg - 90);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const getContrastColor = (hex) => {
    const normalized = hex.replace("#", "");
    if (normalized.length !== 6) return "#ffffff";
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#111111" : "#ffffff";
  };
  let startAngle = -90;
  const slices = [];
  values.forEach((v, i) => {
    const angle = v / total * 360;
    const endAngle = startAngle + angle;
    const start = polarToCartesian(center, center, radius, startAngle);
    const end = polarToCartesian(center, center, radius, endAngle);
    const largeArc = angle > 180 ? 1 : 0;
    const path2 = [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      "Z"
    ].join(" ");
    const midAngle = startAngle + angle / 2;
    const labelPos = polarToCartesian(center, center, (innerRadius + radius) / 2, midAngle);
    const percent = v / total * 100;
    const showPercent = percent >= 4 && angle >= 12;
    slices.push({
      path: path2,
      color: colors[i % colors.length],
      percent,
      label: categories[i],
      midX: labelPos.x,
      midY: labelPos.y,
      showPercent
    });
    startAngle = endAngle;
  });
  const suffix = data.unit ? data.unit === "%" || data.unit.startsWith("%") ? data.unit : ` ${data.unit}` : "";
  const isPercentUnit = suffix === "%" || suffix.startsWith("%");
  const showCenterValue = !isPercentUnit;
  return /* @__PURE__ */ jsxs6(View7, { style: { marginVertical: 8 }, children: [
    /* @__PURE__ */ jsxs6(View7, { style: { flexDirection: "row", alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsxs6(View7, { style: { width: size, height: size }, children: [
        /* @__PURE__ */ jsxs6(Svg, { width: size, height: size, viewBox: `0 0 ${vbSize} ${vbSize}`, children: [
          slices.map((slice, i) => /* @__PURE__ */ jsx7(
            Path,
            {
              d: slice.path,
              fill: slice.color,
              stroke: "#ffffff",
              strokeWidth: 2
            },
            `slice-${i}`
          )),
          /* @__PURE__ */ jsx7(
            Circle,
            {
              cx: center,
              cy: center,
              r: innerRadius,
              fill: "#ffffff"
            }
          )
        ] }),
        slices.map((slice, i) => slice.showPercent && /* @__PURE__ */ jsxs6(
          Text7,
          {
            style: {
              position: "absolute",
              left: slice.midX * scale - 12,
              top: slice.midY * scale - 6,
              fontSize: clamp(10, vbSize * 0.08, 16) * scale * 0.8,
              fontWeight: 800,
              color: getContrastColor(slice.color),
              textAlign: "center",
              width: 24
            },
            children: [
              Math.round(slice.percent),
              "%"
            ]
          },
          `pct-${i}`
        )),
        showCenterValue && /* @__PURE__ */ jsxs6(View7, { style: { position: "absolute", top: center * scale - 12, left: 0, width: size, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx7(Text7, { style: { fontSize: clamp(9, vbSize * 0.06, 14) * scale, color: "#111", fontWeight: 600 }, children: "Total" }),
          /* @__PURE__ */ jsx7(Text7, { style: { fontSize: clamp(12, vbSize * 0.08, 18) * scale, color: "#111", fontWeight: 800 }, children: total.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx7(View7, { style: { flex: 1, marginLeft: 12, paddingTop: 4 }, children: slices.map((slice, i) => /* @__PURE__ */ jsxs6(View7, { style: { flexDirection: "row", alignItems: "center", marginBottom: 5 }, children: [
        /* @__PURE__ */ jsx7(
          View7,
          {
            style: {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: slice.color,
              marginRight: 6
            }
          }
        ),
        /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 7, flex: 1 }, children: sanitizePdfText(slice.label) })
      ] }, `legend-${i}`)) })
    ] }),
    data.subtitle && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 7, color: "#717171", marginTop: 6, textAlign: "center" }, children: sanitizePdfText(data.subtitle) })
  ] });
};
var LineChartPdf = ({ data, compact = false }) => {
  const n = Math.min(data.categories.length, data.values.length);
  if (n <= 0) return null;
  const categories = data.categories.slice(0, n);
  const values = data.values.slice(0, n).map((v) => {
    const num = Number(v);
    return Number.isFinite(num) ? num : 0;
  });
  const vbWidth = 900;
  const vbHeight = 360;
  const scale = compact ? 0.21 : 0.55;
  const width = vbWidth * scale;
  const height = vbHeight * scale;
  const maxVal = Math.max(...values, 1);
  const margin = { top: 80, right: 60, bottom: 80, left: 60 };
  const baselineY = vbHeight - margin.bottom;
  const plotTop = margin.top;
  const plotHeight = baselineY - plotTop;
  const plotWidth = vbWidth - margin.left - margin.right;
  const step = n > 1 ? plotWidth / (n - 1) : 0;
  const centersX = categories.map(
    (_, i) => n > 1 ? margin.left + step * i : margin.left + plotWidth / 2
  );
  const points = values.map((v, i) => ({
    x: centersX[i],
    y: baselineY - v / maxVal * plotHeight
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const valueFont = clamp(12, plotWidth / Math.max(n, 1) * 0.2, 28);
  const categoryFont = clamp(14, plotWidth / Math.max(n, 1) * 0.2, 32);
  const dotR = clamp(3, plotWidth / Math.max(n, 1) * 0.04, 6);
  const lineColor = "#38B9BE";
  const suffix = data.unit ? data.unit === "%" || data.unit.startsWith("%") ? data.unit : ` ${data.unit}` : "";
  return /* @__PURE__ */ jsxs6(View7, { style: { marginVertical: 8, position: "relative" }, children: [
    /* @__PURE__ */ jsxs6(Svg, { width, height, viewBox: `0 0 ${vbWidth} ${vbHeight}`, children: [
      /* @__PURE__ */ jsx7(
        Line,
        {
          x1: 20,
          y1: baselineY,
          x2: vbWidth - 20,
          y2: baselineY,
          stroke: "#7B7B7B",
          strokeWidth: 4
        }
      ),
      /* @__PURE__ */ jsx7(
        Path,
        {
          d: pathD,
          stroke: lineColor,
          strokeWidth: 4,
          fill: "none"
        }
      ),
      points.map((p, i) => /* @__PURE__ */ jsx7(
        Circle,
        {
          cx: p.x,
          cy: p.y,
          r: dotR,
          fill: lineColor
        },
        `dot-${i}`
      ))
    ] }),
    /* @__PURE__ */ jsx7(View7, { style: { position: "absolute", top: 0, left: 0, width, height }, children: points.map((p, i) => /* @__PURE__ */ jsxs6(React2.Fragment, { children: [
      /* @__PURE__ */ jsxs6(
        Text7,
        {
          style: {
            position: "absolute",
            left: p.x * scale - 30,
            top: (p.y - 18) * scale,
            fontSize: valueFont * scale * 0.9,
            fontWeight: 900,
            color: "#111",
            textAlign: "center",
            width: 60
          },
          children: [
            values[i].toLocaleString("fr-FR", { maximumFractionDigits: 2 }),
            suffix
          ]
        }
      ),
      /* @__PURE__ */ jsx7(
        Text7,
        {
          style: {
            position: "absolute",
            left: centersX[i] * scale - 35,
            top: (baselineY + 30) * scale,
            fontSize: categoryFont * scale * 0.9,
            fontWeight: 900,
            color: "#111",
            textAlign: "center",
            width: 70
          },
          children: String(categories[i])
        }
      )
    ] }, `label-${i}`)) }),
    data.title && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 8, color: "#717171", marginTop: 4, textAlign: "center" }, children: sanitizePdfText(data.title) })
  ] });
};
var StackedBarChartPdf = ({ data, compact = false }) => {
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const series = Array.isArray(data.series) ? data.series.filter((s) => Array.isArray(s?.values) && s.values.length) : [];
  const n = Math.min(categories.length, ...series.map((s) => s.values.length));
  if (!series.length || n <= 0) return null;
  const colors = ["#1f2f42", "#38B9BE", "#2E5F7F", "#7B7B7B", "#94A3B8", "#E2E8F0"];
  const vbWidth = 900;
  const vbHeight = 360;
  const scale = compact ? 0.21 : 0.55;
  const width = vbWidth * scale;
  const height = vbHeight * scale;
  const margin = { top: 80, right: 60, bottom: 80, left: 60 };
  const baselineY = vbHeight - margin.bottom;
  const plotTop = margin.top;
  const plotHeight = baselineY - plotTop;
  const barMaxHeight = plotHeight * 0.88;
  const totals = categories.slice(0, n).map(
    (_, i) => series.reduce((sum, s) => {
      const raw = Number(s.values[i]);
      const v = Number.isFinite(raw) ? raw : 0;
      return sum + Math.max(0, v);
    }, 0)
  );
  const maxTotal = Math.max(...totals, 1);
  const scaleY = barMaxHeight / maxTotal;
  const step = (vbWidth - margin.left - margin.right) / n;
  const barWidth = step * 0.38;
  const centersX = categories.map((_, i) => margin.left + step * (i + 0.5));
  const valueFont = clamp(11, step * 0.18, 23);
  const categoryFont = clamp(11, step * 0.18, 23);
  return /* @__PURE__ */ jsxs6(View7, { style: { marginVertical: 8, position: "relative" }, children: [
    /* @__PURE__ */ jsxs6(Svg, { width, height, viewBox: `0 0 ${vbWidth} ${vbHeight}`, children: [
      /* @__PURE__ */ jsx7(
        Line,
        {
          x1: 20,
          y1: baselineY,
          x2: vbWidth - 20,
          y2: baselineY,
          stroke: "#7B7B7B",
          strokeWidth: 4
        }
      ),
      categories.slice(0, n).map((_, i) => {
        const x = centersX[i] - barWidth / 2;
        let currentY = baselineY;
        return /* @__PURE__ */ jsx7(G, { children: series.map((s, sIdx) => {
          const raw = Number(s.values[i]);
          const v = Number.isFinite(raw) ? raw : 0;
          const h = Math.max(0, v) * scaleY;
          const y = currentY - h;
          currentY = y;
          return /* @__PURE__ */ jsx7(
            Rect,
            {
              x,
              y,
              width: barWidth,
              height: h,
              fill: colors[sIdx % colors.length],
              rx: 2
            },
            `stack-${i}-${sIdx}`
          );
        }) }, `stack-${i}`);
      })
    ] }),
    /* @__PURE__ */ jsx7(View7, { style: { position: "absolute", top: 0, left: 0, width, height }, children: totals.map((total, i) => {
      const y = baselineY - total * scaleY;
      return /* @__PURE__ */ jsxs6(React2.Fragment, { children: [
        /* @__PURE__ */ jsx7(
          Text7,
          {
            style: {
              position: "absolute",
              left: centersX[i] * scale - 25,
              top: (y - 20) * scale,
              fontSize: valueFont * scale * 0.9,
              fontWeight: 900,
              color: "#111",
              textAlign: "center",
              width: 50
            },
            children: total.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
          }
        ),
        /* @__PURE__ */ jsx7(
          Text7,
          {
            style: {
              position: "absolute",
              left: centersX[i] * scale - 30,
              top: (baselineY + 30) * scale,
              fontSize: categoryFont * scale * 0.9,
              fontWeight: 900,
              color: "#111",
              textAlign: "center",
              width: 60
            },
            children: String(categories[i])
          }
        )
      ] }, `label-${i}`);
    }) }),
    /* @__PURE__ */ jsx7(View7, { style: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, justifyContent: "center" }, children: series.map((s, idx) => /* @__PURE__ */ jsxs6(View7, { style: { flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 4 }, children: [
      /* @__PURE__ */ jsx7(
        View7,
        {
          style: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors[idx % colors.length],
            marginRight: 4
          }
        }
      ),
      /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 7 }, children: sanitizePdfText(s.name || `S\xE9rie ${idx + 1}`) })
    ] }, `legend-${idx}`)) }),
    data.subtitle && /* @__PURE__ */ jsx7(Text7, { style: { fontSize: 8, color: "#717171", marginTop: 4, textAlign: "center" }, children: sanitizePdfText(data.subtitle) })
  ] });
};
var createCiteCtx4 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber5 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var normalizeTextLines2 = (val) => {
  if (val === null || val === void 0) return [];
  if (Array.isArray(val)) {
    return val.map((v) => v === null || v === void 0 ? "" : String(v)).map((v) => v.trim()).filter(Boolean);
  }
  return String(val).split(/\n+/).map((v) => v.trim()).filter(Boolean);
};
var INLINE_TEXT_CHAR_LIMIT = 1200;
var INLINE_TEXT_MAX_LINES = 3;
var splitInlineText = (lines) => {
  if (!lines.length) return { inlineLines: [], restLines: [] };
  let count = 0;
  let end = 0;
  for (let i = 0; i < lines.length; i += 1) {
    count += lines[i].length;
    end = i + 1;
    if (count >= INLINE_TEXT_CHAR_LIMIT || end >= INLINE_TEXT_MAX_LINES) break;
  }
  return {
    inlineLines: lines.slice(0, end),
    restLines: lines.slice(end)
  };
};
var stripBulletPrefix = (line) => line.replace(/^\s*[-*•]\s*/, "");
var LINK_ANY5 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations5 = (raw, ctx) => {
  LINK_ANY5.lastIndex = 0;
  const rawText = raw ?? "";
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY5.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber5(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs6(Link5, { src: url, style: styles6.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var BULLET_RE2 = /^\s*[-*•]\s+(.*)$/;
var renderTextLines = (lines, citeCtx2, { keyPrefix, paragraphStyle, bulletRowStyle, bulletDotStyle, bulletTextStyle }) => lines.map((line, idx) => {
  const match = line.match(BULLET_RE2);
  if (match) {
    const text = match[1].trim();
    return /* @__PURE__ */ jsxs6(View7, { style: bulletRowStyle ?? styles6.bulletRow, children: [
      /* @__PURE__ */ jsx7(View7, { style: bulletDotStyle ?? styles6.bulletDot }),
      /* @__PURE__ */ jsx7(Text7, { style: bulletTextStyle ?? styles6.bulletText, wrap: true, children: renderInlineCitations5(text, citeCtx2) })
    ] }, `${keyPrefix}-b-${idx}`);
  }
  return /* @__PURE__ */ jsx7(Text7, { style: paragraphStyle ?? styles6.paragraph, wrap: true, children: renderInlineCitations5(line, citeCtx2) }, `${keyPrefix}-p-${idx}`);
});
var VC_THEME = {
  border: "#2f5d78",
  core: { bg: "#2f5d78", text: "#ffffff" },
  nonCore: { bg: "#dce6f2", text: "#1e2b38" },
  pageBg: "#ffffff"
};
var vcKind = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("no core")) return "nonCore";
  if (t.includes("non-core")) return "nonCore";
  if (t.includes("outsource")) return "nonCore";
  return "core";
};
var sortVcSteps = (steps) => [...steps].sort((a, b) => (a?.step_number ?? 0) - (b?.step_number ?? 0));
var parseMdBlocks = (md) => {
  if (md === null || md === void 0) return [];
  const text = Array.isArray(md) ? md.map((v) => v === null || v === void 0 ? "" : String(v)).join("\n") : String(md);
  if (!text.trim()) return [];
  return text.replace(/\r/g, "").split("\n").map((raw) => raw.replace(/\t/g, "  ")).map((raw) => {
    const trimmed = raw.trimEnd();
    return { raw, trimmed };
  }).filter(({ trimmed }) => trimmed.trim().length > 0).map(({ raw, trimmed }) => {
    const indent = raw.match(/^\s*/)?.[0].length ?? 0;
    const level = indent >= 2 ? 1 : 0;
    const m = trimmed.trim().match(/^([-*•])\s+(.*)$/);
    if (m) return { kind: "bullet", level, text: m[2].trim() };
    return { kind: "paragraph", text: trimmed.trim() };
  });
};
var VC_CARD_GAP = 10;
var VC_CARD_MIN_H = 170;
var VC_CARD_PADDING_X = 16;
var VC_CARD_PADDING_Y = 0;
var VC_CARD_HEADER_H = 24;
var VC_CARD_HEADER_MARGIN_BOTTOM = 6;
var VC_CARD_BODY_FONT_SIZE = 8;
var VC_CARD_BODY_LINE_HEIGHT = 1.25;
var VC_CARD_BODY_LINE_PX = VC_CARD_BODY_FONT_SIZE * VC_CARD_BODY_LINE_HEIGHT;
var VC_CARD_BODY_BLOCK_MARGIN = 4;
var VC_CARD_BULLET_INDENT = 9;
var VC_CARD_BULLET_NESTED_INDENT = 8;
var VC_CARD_TEXT_CHAR_WIDTH = 0.52;
var VC_CARD_HEIGHT_BUFFER = VC_CARD_BODY_LINE_PX;
var estimateTextLines = (text, maxChars) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return 0;
  const words = normalized.split(" ");
  let lines = 1;
  let lineLen = 0;
  for (const word of words) {
    const wordLen = word.length;
    if (lineLen === 0) {
      if (wordLen > maxChars) {
        const extraLines = Math.ceil(wordLen / maxChars);
        lines += extraLines - 1;
        lineLen = wordLen % maxChars;
        if (lineLen === 0) lineLen = maxChars;
      } else {
        lineLen = wordLen;
      }
      continue;
    }
    if (lineLen + 1 + wordLen <= maxChars) {
      lineLen += 1 + wordLen;
      continue;
    }
    lines += 1;
    if (wordLen > maxChars) {
      const extraLines = Math.ceil(wordLen / maxChars);
      lines += extraLines - 1;
      lineLen = wordLen % maxChars;
      if (lineLen === 0) lineLen = maxChars;
    } else {
      lineLen = wordLen;
    }
  }
  return lines;
};
var estimateVcCardHeight = (step, cardW) => {
  const blocks = parseMdBlocks(step.core_activities);
  if (!blocks.length) return VC_CARD_MIN_H;
  const baseHeight = VC_CARD_HEADER_H + VC_CARD_HEADER_MARGIN_BOTTOM + VC_CARD_PADDING_Y;
  let textHeight = 0;
  for (const block of blocks) {
    const indent = block.kind === "bullet" ? VC_CARD_BULLET_INDENT + (block.level > 0 ? VC_CARD_BULLET_NESTED_INDENT : 0) : 0;
    const textWidth = Math.max(1, cardW - VC_CARD_PADDING_X - indent);
    const maxChars = Math.max(
      1,
      Math.floor(textWidth / (VC_CARD_BODY_FONT_SIZE * VC_CARD_TEXT_CHAR_WIDTH))
    );
    const lines = estimateTextLines(block.text, maxChars);
    if (!lines) continue;
    textHeight += lines * VC_CARD_BODY_LINE_PX + VC_CARD_BODY_BLOCK_MARGIN;
  }
  return Math.ceil(
    Math.max(VC_CARD_MIN_H, baseHeight + textHeight + VC_CARD_HEIGHT_BUFFER)
  );
};
var estimateMaxVcCardHeight = (steps, cardW) => steps.reduce(
  (maxHeight, step) => Math.max(maxHeight, estimateVcCardHeight(step, cardW)),
  VC_CARD_MIN_H
);
var ValueChainCardPdf = ({
  step,
  citeCtx: citeCtx2,
  height
}) => {
  const kind = vcKind(step.type);
  const theme = kind === "core" ? VC_THEME.core : VC_THEME.nonCore;
  const blocks = parseMdBlocks(step.core_activities);
  const titleBase = step.name || "\xC9tape";
  const title = step.step_number ? `${step.step_number}. ${titleBase}` : titleBase;
  return /* @__PURE__ */ jsxs6(View7, { style: [styles6.vcCard, height ? { height } : null], wrap: false, children: [
    /* @__PURE__ */ jsx7(View7, { style: [styles6.vcCardHeader, { backgroundColor: theme.bg }], children: /* @__PURE__ */ jsx7(Text7, { style: [styles6.vcCardTitle, { color: theme.text }], children: renderInlineCitations5(title, citeCtx2) }) }),
    /* @__PURE__ */ jsx7(View7, { children: blocks.map((b, idx) => {
      if (b.kind === "bullet") {
        const isNested = b.level > 0;
        return /* @__PURE__ */ jsxs6(View7, { style: styles6.vcBulletRow, children: [
          /* @__PURE__ */ jsx7(
            View7,
            {
              style: [
                styles6.vcBulletSquare,
                isNested ? {
                  borderWidth: 1,
                  borderColor: VC_THEME.nonCore.text,
                  backgroundColor: "#ffffff",
                  marginLeft: 8
                } : { backgroundColor: VC_THEME.nonCore.text }
              ]
            }
          ),
          /* @__PURE__ */ jsx7(Text7, { style: [styles6.vcCardBodyLine, { flex: 1 }], wrap: true, children: renderInlineCitations5(b.text, citeCtx2) })
        ] }, `vc-b-${idx}`);
      }
      return /* @__PURE__ */ jsx7(Text7, { style: styles6.vcCardBodyLine, wrap: true, children: renderInlineCitations5(b.text, citeCtx2) }, `vc-p-${idx}`);
    }) })
  ] });
};
var ValueChainCardsRowPdf = ({
  steps,
  citeCtx: citeCtx2,
  cardHeight
}) => {
  const cols = Math.max(1, steps.length);
  const cardW = (CONTENT_W - VC_CARD_GAP * (cols - 1)) / cols;
  return /* @__PURE__ */ jsx7(View7, { style: styles6.vcCardsRow, children: steps.map((s, idx) => /* @__PURE__ */ jsx7(
    View7,
    {
      style: { width: cardW, marginRight: idx === cols - 1 ? 0 : VC_CARD_GAP },
      wrap: false,
      children: /* @__PURE__ */ jsx7(ValueChainCardPdf, { step: s, citeCtx: citeCtx2, height: cardHeight })
    },
    `vc-card-${s.step_number}-${idx}`
  )) });
};
var ValueChainLegendPdf = ({
  coreLabel = "Core business",
  nonCoreLabel = "Non-core business"
}) => /* @__PURE__ */ jsxs6(View7, { style: styles6.vcLegend, wrap: false, children: [
  /* @__PURE__ */ jsxs6(View7, { style: [styles6.vcLegendItem, { marginRight: 50 }], children: [
    /* @__PURE__ */ jsx7(View7, { style: [styles6.vcLegendSwatch, { backgroundColor: VC_THEME.core.bg }] }),
    /* @__PURE__ */ jsx7(Text7, { style: styles6.vcLegendLabel, children: coreLabel })
  ] }),
  /* @__PURE__ */ jsxs6(View7, { style: styles6.vcLegendItem, children: [
    /* @__PURE__ */ jsx7(
      View7,
      {
        style: [
          styles6.vcLegendSwatch,
          {
            backgroundColor: VC_THEME.nonCore.bg,
            borderWidth: 1,
            borderColor: VC_THEME.border
          }
        ]
      }
    ),
    /* @__PURE__ */ jsx7(Text7, { style: styles6.vcLegendLabel, children: nonCoreLabel })
  ] })
] });
var ValueChainPdfBlock = ({
  data,
  citeCtx: citeCtx2
}) => {
  const steps = sortVcSteps(Array.isArray(data?.steps) ? data.steps : []);
  if (!steps.length) return null;
  const n = steps.length;
  const topCols = n <= 4 ? n : Math.ceil(n / 2);
  const topSteps = steps.slice(0, topCols);
  const bottomSteps = steps.slice(topCols);
  const topCardW = (CONTENT_W - VC_CARD_GAP * (topCols - 1)) / topCols;
  const bottomCardW = bottomSteps.length > 0 ? (CONTENT_W - VC_CARD_GAP * (bottomSteps.length - 1)) / bottomSteps.length : topCardW;
  const maxCardHeight = Math.max(
    estimateMaxVcCardHeight(topSteps, topCardW),
    bottomSteps.length ? estimateMaxVcCardHeight(bottomSteps, bottomCardW) : 0
  );
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.vcWrap, wrap: false, children: [
    /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: "Cha\xEEne de valeur" }),
    data?.introduction ? renderTextLines(normalizeTextLines2(data.introduction), citeCtx2, {
      keyPrefix: "vc-intro",
      paragraphStyle: styles6.vcIntroLine,
      bulletRowStyle: [styles6.bulletRow, { marginBottom: 4 }],
      bulletDotStyle: [styles6.bulletDot, { marginTop: 4 }],
      bulletTextStyle: [styles6.bulletText, { fontSize: 8, lineHeight: 1.3 }]
    }) : null,
    topSteps.length ? /* @__PURE__ */ jsx7(
      ValueChainCardsRowPdf,
      {
        steps: topSteps,
        citeCtx: citeCtx2,
        cardHeight: maxCardHeight
      }
    ) : null,
    bottomSteps.length ? /* @__PURE__ */ jsx7(
      ValueChainCardsRowPdf,
      {
        steps: bottomSteps,
        citeCtx: citeCtx2,
        cardHeight: maxCardHeight
      }
    ) : null,
    /* @__PURE__ */ jsx7(ValueChainLegendPdf, {})
  ] });
};
var DF_THEME = {
  border: "#2e5f7f",
  bullet: "#4f8935",
  arrowLight: "#DFE9F6"
};
var DF_GAP = 12;
var DF_LEFT_W = 155;
var DF_ARROW_W = 36;
var DF_MIDDLE_W = Math.max(
  160,
  CONTENT_W - DF_LEFT_W - DF_ARROW_W - DF_GAP * 2
);
var DF_ARROW_H = 18;
var DF_ARROW_DARK = "M0 0 L55 0 L80 30 L55 60 L0 60 L25 30 Z";
var DF_ARROW_LIGHT = "M35 1 L90 1 L115 30 L90 59 L35 59 L60 30 Z";
var DriversArrowPdf = () => /* @__PURE__ */ jsxs6(Svg, { width: DF_ARROW_W, height: DF_ARROW_H, viewBox: "0 0 120 60", children: [
  /* @__PURE__ */ jsx7(Path, { d: DF_ARROW_DARK, fill: DF_THEME.border }),
  /* @__PURE__ */ jsx7(
    Path,
    {
      d: DF_ARROW_LIGHT,
      fill: DF_THEME.arrowLight,
      stroke: DF_THEME.border,
      strokeWidth: 2,
      strokeDasharray: "6 5",
      strokeLinejoin: "round"
    }
  )
] });
var DriversRowPdf = ({
  driver,
  citeCtx: citeCtx2
}) => {
  const title = driver?.driver_title || "";
  const args2 = Array.isArray(driver?.arguments) ? driver.arguments.map((a) => a === null || a === void 0 ? "" : String(a)) : [];
  const logoUrl = driver?.logo?.url;
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.dfRow, wrap: false, children: [
    /* @__PURE__ */ jsxs6(View7, { style: [styles6.dfCard, styles6.dfLeft, { width: DF_LEFT_W }], children: [
      /* @__PURE__ */ jsx7(View7, { style: styles6.dfLeftIconWrap, children: logoUrl ? /* @__PURE__ */ jsx7(Image4, { src: logoUrl, style: styles6.dfLeftIcon }) : null }),
      /* @__PURE__ */ jsx7(View7, { style: styles6.dfDivider }),
      /* @__PURE__ */ jsx7(Text7, { style: styles6.dfLeftTitle, wrap: true, children: renderInlineCitations5(title, citeCtx2) })
    ] }),
    /* @__PURE__ */ jsx7(
      View7,
      {
        style: [
          styles6.dfArrowWrap,
          { width: DF_ARROW_W, marginLeft: DF_GAP, marginRight: DF_GAP }
        ],
        children: /* @__PURE__ */ jsx7(DriversArrowPdf, {})
      }
    ),
    /* @__PURE__ */ jsx7(View7, { style: [styles6.dfCard, styles6.dfMiddle, { width: DF_MIDDLE_W }], children: args2.map((txt, i) => /* @__PURE__ */ jsxs6(View7, { style: styles6.dfBulletItem, children: [
      /* @__PURE__ */ jsx7(View7, { style: styles6.dfBulletSquare }),
      /* @__PURE__ */ jsx7(Text7, { style: styles6.dfBulletText, wrap: true, children: renderInlineCitations5(txt, citeCtx2) })
    ] }, `df-b-${i}`)) })
  ] });
};
var DriversFlowPdfBlock = ({
  data,
  citeCtx: citeCtx2
}) => {
  const drivers = Array.isArray(data) ? data : Array.isArray(data?.drivers) ? data.drivers : [];
  if (!drivers.length) return null;
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.dfWrap, children: [
    /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: "Facteurs de croissance" }),
    drivers.map((d, idx) => /* @__PURE__ */ jsx7(
      DriversRowPdf,
      {
        driver: d,
        citeCtx: citeCtx2
      },
      `df-${idx}`
    ))
  ] });
};
var BD_QUADS = ["tl", "tr", "bl", "br"];
var bdSide = (q) => q === "tl" || q === "bl" ? "left" : "right";
var BD_ACCENT = "#2e5f7f";
var BD_GAP = 30;
var BD_LINE_THICK = 2;
var BD_BADGE = 34;
var BD_CARD_TOP = 30;
var BD_CARD_MIN_H = 180;
var BD_CELL_W = (CONTENT_W - BD_GAP) / 2;
var BD_CARD_PADDING_TOP = 12;
var BD_CARD_PADDING_BOTTOM = 2;
var BD_CARD_PADDING_X = 12;
var BD_BULLET_FONT_SIZE = 8;
var BD_BULLET_LINE_HEIGHT = 1.22;
var BD_BULLET_LINE_PX = BD_BULLET_FONT_SIZE * BD_BULLET_LINE_HEIGHT;
var BD_BULLET_MARGIN_BOTTOM = 6;
var BD_BULLET_INDENT = 10;
var BD_TEXT_CHAR_WIDTH = 0.52;
var BD_CARD_HEIGHT_BUFFER = BD_BULLET_LINE_PX;
var BD_CARD_EXTRA_HEIGHT = 2;
var BD_CARD_LONG_THRESHOLD = BD_CARD_MIN_H + 60;
var BD_CORE_MAX_HEIGHT = CONTENT_H - 120;
var ME_MAX_ROWS_PER_PAGE = 6;
var MD_LINK_IN_PARENS = /\(\s*\[[^\]]+]\((https?:\/\/[^\s)]+)\)\s*\)/g;
var normalizeBarrierBullet = (raw) => {
  const s = stripBulletPrefix(String(raw ?? ""));
  return s.replace(MD_LINK_IN_PARENS, " $1").replace(/\s+/g, " ").trim();
};
var getBarrierBullets = (barriere) => Array.isArray(barriere?.bullet_points) ? barriere.bullet_points.map(normalizeBarrierBullet).filter(Boolean) : [];
var estimateBarrierCardHeight = (bullets) => {
  if (!bullets.length) return BD_CARD_MIN_H;
  const textWidth = Math.max(
    1,
    BD_CELL_W - BD_CARD_PADDING_X * 2 - BD_BULLET_INDENT
  );
  const maxChars = Math.max(
    1,
    Math.floor(textWidth / (BD_BULLET_FONT_SIZE * BD_TEXT_CHAR_WIDTH))
  );
  let bodyHeight = 0;
  bullets.forEach((bullet, idx) => {
    const segments = String(bullet).split(/\n+/).map((s) => s.trim()).filter(Boolean);
    const lines = segments.length ? segments.reduce((sum, seg) => sum + estimateTextLines(seg, maxChars), 0) : estimateTextLines(String(bullet), maxChars);
    bodyHeight += lines * BD_BULLET_LINE_PX;
    if (idx < bullets.length - 1) bodyHeight += BD_BULLET_MARGIN_BOTTOM;
  });
  return Math.ceil(
    Math.max(
      BD_CARD_MIN_H,
      BD_CARD_PADDING_TOP + BD_CARD_PADDING_BOTTOM + bodyHeight + BD_CARD_HEIGHT_BUFFER
    )
  );
};
var computeBarrierLayout = (items) => {
  const heights = items.map(
    (item) => estimateBarrierCardHeight(getBarrierBullets(item))
  );
  const topHeights = heights.slice(0, 2);
  const bottomHeights = heights.slice(2, 4);
  const topMax = topHeights.length ? Math.max(...topHeights) : BD_CARD_MIN_H;
  const bottomMax = bottomHeights.length ? Math.max(...bottomHeights) : BD_CARD_MIN_H;
  const topCardHeight = Math.max(BD_CARD_MIN_H, topMax) + BD_CARD_EXTRA_HEIGHT;
  const bottomCardHeight = Math.max(BD_CARD_MIN_H, bottomMax) + BD_CARD_EXTRA_HEIGHT;
  const topCellHeight = BD_CARD_TOP + topCardHeight;
  const bottomCellHeight = BD_CARD_TOP + bottomCardHeight;
  const coreHeight = topCellHeight + BD_GAP + bottomCellHeight;
  const maxCardHeight = Math.max(topCardHeight, bottomCardHeight);
  return {
    topCardHeight,
    bottomCardHeight,
    topCellHeight,
    bottomCellHeight,
    maxCardHeight,
    coreHeight
  };
};
var computeBarrierRowLayout = (items) => {
  const heights = items.map(
    (item) => estimateBarrierCardHeight(getBarrierBullets(item))
  );
  const maxEstimated = heights.length ? Math.max(...heights) : BD_CARD_MIN_H;
  const cardHeight = Math.max(BD_CARD_MIN_H, maxEstimated) + BD_CARD_EXTRA_HEIGHT;
  const cellHeight = BD_CARD_TOP + cardHeight;
  return { cardHeight, cellHeight };
};
var BarrierCardPdf = ({
  barriere,
  quadrant,
  citeCtx: citeCtx2,
  cardHeight,
  cellHeight
}) => {
  if (!barriere) {
    return /* @__PURE__ */ jsx7(View7, { style: [styles6.bdCell, { width: BD_CELL_W, height: cellHeight }] });
  }
  const side = bdSide(quadrant);
  const title = barriere?.titre || "";
  const logoUrl = typeof barriere?.logo === "string" ? barriere.logo : "";
  const bullets = getBarrierBullets(barriere);
  const spacer = /* @__PURE__ */ jsx7(View7, { style: { width: BD_BADGE } });
  return /* @__PURE__ */ jsxs6(View7, { style: [styles6.bdCell, { width: BD_CELL_W, height: cellHeight }], wrap: false, children: [
    /* @__PURE__ */ jsx7(
      View7,
      {
        style: [
          styles6.bdCard,
          {
            marginTop: BD_CARD_TOP,
            height: cardHeight,
            borderColor: BD_ACCENT
          }
        ],
        wrap: false,
        children: bullets.map((txt, i) => /* @__PURE__ */ jsxs6(
          View7,
          {
            style: [
              styles6.bdBulletRow,
              i === bullets.length - 1 ? { marginBottom: 0 } : null
            ],
            children: [
              /* @__PURE__ */ jsx7(View7, { style: [styles6.bdBulletDot, { backgroundColor: BD_ACCENT }] }),
              /* @__PURE__ */ jsx7(Text7, { style: styles6.bdBulletText, wrap: true, children: renderInlineCitations5(txt, citeCtx2) })
            ]
          },
          `${quadrant}-b-${i}`
        ))
      }
    ),
    /* @__PURE__ */ jsx7(View7, { style: styles6.bdHead, wrap: false, children: side === "left" ? /* @__PURE__ */ jsxs6(Fragment2, { children: [
      /* @__PURE__ */ jsx7(View7, { style: [styles6.bdBadge, { borderColor: BD_ACCENT }], children: logoUrl ? /* @__PURE__ */ jsx7(Image4, { src: logoUrl, style: styles6.bdBadgeImg }) : null }),
      /* @__PURE__ */ jsx7(Text7, { style: [styles6.bdTitle, { color: BD_ACCENT }], wrap: true, children: renderInlineCitations5(title, citeCtx2) }),
      spacer
    ] }) : /* @__PURE__ */ jsxs6(Fragment2, { children: [
      spacer,
      /* @__PURE__ */ jsx7(Text7, { style: [styles6.bdTitle, { color: BD_ACCENT }], wrap: true, children: renderInlineCitations5(title, citeCtx2) }),
      /* @__PURE__ */ jsx7(View7, { style: [styles6.bdBadge, { borderColor: BD_ACCENT }], children: logoUrl ? /* @__PURE__ */ jsx7(Image4, { src: logoUrl, style: styles6.bdBadgeImg }) : null })
    ] }) })
  ] });
};
var BarrieresRowPdfBlock = ({
  items,
  citeCtx: citeCtx2,
  row,
  titleSuffix
}) => {
  const [leftItem = null, rightItem = null] = items;
  const { cardHeight, cellHeight } = computeBarrierRowLayout([leftItem, rightItem]);
  const leftQuad = row === "top" ? "tl" : "bl";
  const rightQuad = row === "top" ? "tr" : "br";
  const title = titleSuffix ? `Barri\xE8res \xE0 l\u2019entr\xE9e ${titleSuffix}` : "Barri\xE8res \xE0 l\u2019entr\xE9e";
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.bdWrap, wrap: false, children: [
    /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: title }),
    /* @__PURE__ */ jsxs6(View7, { style: [styles6.bdCore, { width: CONTENT_W, height: cellHeight }], wrap: false, children: [
      /* @__PURE__ */ jsx7(
        View7,
        {
          style: [
            styles6.bdLine,
            {
              top: 0,
              bottom: 0,
              left: CONTENT_W / 2 - BD_LINE_THICK / 2,
              width: BD_LINE_THICK,
              backgroundColor: BD_ACCENT
            }
          ]
        }
      ),
      /* @__PURE__ */ jsx7(View7, { style: styles6.bdGrid, children: /* @__PURE__ */ jsxs6(View7, { style: styles6.bdRow, wrap: false, children: [
        /* @__PURE__ */ jsx7(
          BarrierCardPdf,
          {
            barriere: leftItem,
            quadrant: leftQuad,
            citeCtx: citeCtx2,
            cardHeight,
            cellHeight
          }
        ),
        /* @__PURE__ */ jsx7(View7, { style: { width: BD_GAP } }),
        /* @__PURE__ */ jsx7(
          BarrierCardPdf,
          {
            barriere: rightItem,
            quadrant: rightQuad,
            citeCtx: citeCtx2,
            cardHeight,
            cellHeight
          }
        )
      ] }) })
    ] })
  ] });
};
var BarrieresDiagramPdfBlock = ({
  data,
  citeCtx: citeCtx2,
  layout
}) => {
  const items = Array.isArray(data?.items) ? data.items : [];
  if (!items.length) return null;
  const slots = BD_QUADS.map((_, i) => items[i] ?? null);
  const {
    topCardHeight,
    bottomCardHeight,
    topCellHeight,
    bottomCellHeight,
    coreHeight
  } = layout ?? computeBarrierLayout(slots);
  const midY = topCellHeight + BD_GAP / 2 - BD_LINE_THICK / 2;
  const midX = CONTENT_W / 2 - BD_LINE_THICK / 2;
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.bdWrap, wrap: false, children: [
    /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: "Barri\xE8res \xE0 l\u2019entr\xE9e" }),
    /* @__PURE__ */ jsxs6(View7, { style: [styles6.bdCore, { width: CONTENT_W, height: coreHeight }], wrap: false, children: [
      /* @__PURE__ */ jsx7(
        View7,
        {
          style: [
            styles6.bdLine,
            {
              left: 0,
              right: 0,
              top: midY,
              height: BD_LINE_THICK,
              backgroundColor: BD_ACCENT
            }
          ]
        }
      ),
      /* @__PURE__ */ jsx7(
        View7,
        {
          style: [
            styles6.bdLine,
            {
              top: 0,
              bottom: 0,
              left: midX,
              width: BD_LINE_THICK,
              backgroundColor: BD_ACCENT
            }
          ]
        }
      ),
      /* @__PURE__ */ jsxs6(View7, { style: styles6.bdGrid, children: [
        /* @__PURE__ */ jsxs6(View7, { style: [styles6.bdRow, { marginBottom: BD_GAP }], wrap: false, children: [
          /* @__PURE__ */ jsx7(
            BarrierCardPdf,
            {
              barriere: slots[0],
              quadrant: "tl",
              citeCtx: citeCtx2,
              cardHeight: topCardHeight,
              cellHeight: topCellHeight
            }
          ),
          /* @__PURE__ */ jsx7(View7, { style: { width: BD_GAP } }),
          /* @__PURE__ */ jsx7(
            BarrierCardPdf,
            {
              barriere: slots[1],
              quadrant: "tr",
              citeCtx: citeCtx2,
              cardHeight: topCardHeight,
              cellHeight: topCellHeight
            }
          )
        ] }),
        /* @__PURE__ */ jsxs6(View7, { style: styles6.bdRow, wrap: false, children: [
          /* @__PURE__ */ jsx7(
            BarrierCardPdf,
            {
              barriere: slots[2],
              quadrant: "bl",
              citeCtx: citeCtx2,
              cardHeight: bottomCardHeight,
              cellHeight: bottomCellHeight
            }
          ),
          /* @__PURE__ */ jsx7(View7, { style: { width: BD_GAP } }),
          /* @__PURE__ */ jsx7(
            BarrierCardPdf,
            {
              barriere: slots[3],
              quadrant: "br",
              citeCtx: citeCtx2,
              cardHeight: bottomCardHeight,
              cellHeight: bottomCellHeight
            }
          )
        ] })
      ] })
    ] })
  ] });
};
var isHttpUrl = (s) => /^https?:\/\/\S+$/i.test(s);
var isDataImageUrl = (s) => /^data:image\//i.test(s);
var normalizeLogoUrl = (raw) => {
  const s = raw.trim();
  if (!s) return null;
  if (isDataImageUrl(s)) return s;
  if (isHttpUrl(s)) return normalizeAssetUrl(s);
  if (s.startsWith("//")) return normalizeAssetUrl(`https:${s}`);
  if (/^[^\s]+\.[^\s]+/.test(s)) {
    if (s.includes("/") || /\.(png|jpe?g|svg|webp)(\?.*)?$/i.test(s)) {
      return normalizeAssetUrl(`https://${s}`);
    }
    return null;
  }
  return null;
};
var toWebsiteHref = (label) => {
  const s = (label || "").trim();
  if (!s) return null;
  if (isHttpUrl(s)) return s;
  if (/^[^\s]+\.[^\s]+$/.test(s)) return `https://${s}`;
  return null;
};
var guessAltFromUrl = (url) => {
  try {
    const last = url.split("/").pop() || "logo";
    return decodeURIComponent(last).replace(/\.(png|jpg|jpeg|svg|webp)$/i, "") || "logo";
  } catch {
    return "logo";
  }
};
var parseEcoLogoList = (list) => {
  if (!list) return [];
  if (Array.isArray(list)) {
    return list.map((entry) => {
      if (typeof entry === "string") {
        const label = entry.trim();
        const logoUrl = normalizeLogoUrl(label);
        if (logoUrl) {
          return {
            kind: "img",
            label: guessAltFromUrl(logoUrl),
            logoUrl,
            href: toWebsiteHref(label)
          };
        }
        return label ? { kind: "text", text: label, href: toWebsiteHref(label) } : null;
      }
      if (Array.isArray(entry)) {
        const label = typeof entry[0] === "string" ? entry[0].trim() : "";
        const url = typeof entry[1] === "string" ? entry[1].trim() : "";
        const logoUrl = normalizeLogoUrl(url) ?? normalizeLogoUrl(label);
        const href = toWebsiteHref(label) ?? toWebsiteHref(url);
        if (logoUrl) {
          return {
            kind: "img",
            label: label || guessAltFromUrl(logoUrl),
            logoUrl,
            href
          };
        }
        if (label) {
          return {
            kind: "text",
            text: label,
            href
          };
        }
        return null;
      }
      if (entry && typeof entry === "object") {
        const obj = entry;
        const label = typeof obj.label === "string" && obj.label.trim() || typeof obj.name === "string" && obj.name.trim() || typeof obj.title === "string" && obj.title.trim() || "";
        const url = typeof obj.logo_url === "string" && obj.logo_url.trim() || typeof obj.logoUrl === "string" && obj.logoUrl.trim() || typeof obj.logo === "string" && obj.logo.trim() || typeof obj.url === "string" && obj.url.trim() || typeof obj.website === "string" && obj.website.trim() || typeof obj.domain === "string" && obj.domain.trim() || "";
        const logoUrl = normalizeLogoUrl(url) ?? normalizeLogoUrl(label);
        const href = toWebsiteHref(label) ?? toWebsiteHref(url);
        if (logoUrl) {
          return {
            kind: "img",
            label: label || guessAltFromUrl(logoUrl),
            logoUrl,
            href
          };
        }
        if (label) {
          return {
            kind: "text",
            text: label,
            href
          };
        }
      }
      return null;
    }).filter(Boolean);
  }
  return String(list).split(";").map((s) => s.trim()).filter(Boolean).map((entry) => {
    const logoUrl = normalizeLogoUrl(entry);
    if (logoUrl) {
      return {
        kind: "img",
        label: guessAltFromUrl(logoUrl),
        logoUrl,
        href: toWebsiteHref(entry)
      };
    }
    return { kind: "text", text: entry, href: toWebsiteHref(entry) };
  });
};
var EcosystemCardPdf = ({
  align,
  typeText,
  logos,
  citeCtx: citeCtx2
}) => {
  const hasType = Boolean(typeText && String(typeText).trim().length > 0);
  const safeType = typeText || "";
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.meCard, wrap: false, children: [
    /* @__PURE__ */ jsx7(
      Text7,
      {
        style: [
          styles6.meTypeBox,
          align === "right" ? { textAlign: "right" } : null,
          !hasType ? { color: "transparent" } : null
        ],
        wrap: true,
        children: hasType ? renderInlineCitations5(safeType, citeCtx2) : " "
      }
    ),
    /* @__PURE__ */ jsx7(View7, { style: styles6.meLogos, children: logos.slice(0, 3).map((it, i) => {
      const key = `${it.kind}-${("label" in it ? it.label : it.text) || ""}-${i}`;
      if (it.kind === "img") {
        return /* @__PURE__ */ jsx7(View7, { style: styles6.meLogoItem, wrap: false, children: /* @__PURE__ */ jsx7(Image4, { src: it.logoUrl, style: styles6.meLogoImg }) }, key);
      }
      const pill = /* @__PURE__ */ jsx7(Text7, { style: styles6.mePill, children: renderInlineCitations5(it.text, citeCtx2) });
      return /* @__PURE__ */ jsx7(View7, { style: { marginVertical: 2, marginHorizontal: 2 }, wrap: false, children: pill }, key);
    }) })
  ] });
};
var MarketEcosystemPdfBlock = ({
  data,
  citeCtx: citeCtx2,
  suppliers,
  clients
}) => {
  const suppliersList = suppliers ?? (Array.isArray(data?.supplier_types) ? data.supplier_types : []);
  const clientsList = clients ?? (Array.isArray(data?.client_types) ? data.client_types : []);
  const rows = Math.max(suppliersList.length, clientsList.length, 1);
  const COL_GAP = 28;
  const COL_W = (CONTENT_W - COL_GAP) / 2;
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.meWrap, wrap: false, children: [
    /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: "\xC9cosyst\xE8me du march\xE9" }),
    /* @__PURE__ */ jsxs6(View7, { style: styles6.meRoot, wrap: false, children: [
      /* @__PURE__ */ jsx7(View7, { style: styles6.meDivider }),
      /* @__PURE__ */ jsxs6(View7, { style: styles6.meGridRow, wrap: false, children: [
        /* @__PURE__ */ jsxs6(View7, { style: [styles6.meColumnWrap, { width: COL_W }], wrap: false, children: [
          /* @__PURE__ */ jsx7(Text7, { style: styles6.meHeader, children: "Fournisseurs" }),
          Array.from({ length: rows }).map((_, i) => {
            const row = suppliersList[i];
            const typeText = row?.type;
            const logos = parseEcoLogoList(row?.key_suppliers ?? null);
            return /* @__PURE__ */ jsx7(
              EcosystemCardPdf,
              {
                align: "left",
                typeText,
                logos,
                citeCtx: citeCtx2
              },
              `sup-${i}`
            );
          })
        ] }),
        /* @__PURE__ */ jsx7(View7, { style: { width: COL_GAP } }),
        /* @__PURE__ */ jsxs6(View7, { style: [styles6.meColumnWrap, { width: COL_W }], wrap: false, children: [
          /* @__PURE__ */ jsx7(Text7, { style: styles6.meHeader, children: "Clients" }),
          Array.from({ length: rows }).map((_, i) => {
            const row = clientsList[i];
            const typeText = row?.type;
            const logos = parseEcoLogoList(row?.key_clients ?? null);
            return /* @__PURE__ */ jsx7(
              EcosystemCardPdf,
              {
                align: "right",
                typeText,
                logos,
                citeCtx: citeCtx2
              },
              `cli-${i}`
            );
          })
        ] })
      ] })
    ] })
  ] });
};
var emNormalizeKey = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
var labelFromS3LogoUrl = (logoUrl) => {
  try {
    const u = new URL(logoUrl);
    const path2 = decodeURIComponent(u.pathname || "");
    const parts = path2.split("/").filter(Boolean);
    if (parts.length >= 2) return parts[parts.length - 2];
    if (parts.length === 1) {
      return parts[0].replace(/\/logo\.(png|jpg|jpeg|svg|webp)$/i, "");
    }
    return null;
  } catch {
    return null;
  }
};
var END_CLIENT_WEBSITE_RULES = [
  [/airbus/i, "https://www.airbus.com"],
  [/boeing/i, "https://www.boeing.com"],
  [/safran/i, "https://www.safran-group.com"],
  [/lisi/i, "https://www.lisi-aerospace.com"],
  [/honeywell/i, "https://www.honeywell.com"],
  [/dassault/i, "https://www.dassault-aviation.com"],
  [/mbda/i, "https://www.mbda-systems.com"],
  [/thales/i, "https://www.thalesgroup.com"],
  [/naval\s*group/i, "https://www.naval-group.com"],
  [/ariane/i, "https://www.ariane.group"],
  [/sodern/i, "https://www.sodern.com"],
  [/alstom/i, "https://www.alstom.com"],
  [/sncf\s*reseau/i, "https://www.sncf-reseau.com"],
  [/sncf\s*voyageurs/i, "https://www.sncf-voyageurs.com"],
  [/stadler/i, "https://www.stadlerrail.com"],
  [/\bcaf\b/i, "https://www.caf.net"],
  [/edf\s*renewables|edf\s*renouvelables/i, "https://www.edf-renouvelables.com"],
  [/edf/i, "https://www.edf.fr"],
  [/framatome/i, "https://www.framatome.com"],
  [/orano/i, "https://www.orano.group"],
  [/gd\s*energy|gdes/i, "https://gdes.com"],
  [/\brte\b/i, "https://www.rte-france.com"],
  [/siemens\s*gamesa/i, "https://www.siemensgamesa.com"],
  [/totalenergies/i, "https://totalenergies.com"],
  [/chantiers.*atlantique/i, "https://www.chantiers-atlantique.com"]
];
var inferWebsiteFromLabel = (label) => {
  const s = (label || "").trim();
  if (!s) return null;
  if (/^[^\s]+\.[^\s]+$/.test(s)) return `https://${s}`;
  const key = emNormalizeKey(s);
  for (const [re, href] of END_CLIENT_WEBSITE_RULES) {
    if (re.test(key)) return href;
  }
  return null;
};
var looksLikeHttpUrl = (s) => /^https?:\/\/\S+$/i.test(s);
var parseEndMarketClients = (raw) => {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((c) => {
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const anyC = c;
      const logoUrl = typeof anyC.logoUrl === "string" ? anyC.logoUrl.trim() : "";
      const name = typeof anyC.name === "string" ? anyC.name.trim() : "";
      const websiteUrl = typeof anyC.websiteUrl === "string" ? anyC.websiteUrl.trim() : "";
      if (logoUrl && looksLikeHttpUrl(logoUrl)) {
        const href = websiteUrl || inferWebsiteFromLabel(name) || inferWebsiteFromLabel(labelFromS3LogoUrl(logoUrl));
        return { kind: "img", logoUrl, href, alt: name || void 0 };
      }
      if (name) {
        const href = websiteUrl || inferWebsiteFromLabel(name);
        return { kind: "text", text: name, href };
      }
      return null;
    }
    if (typeof c === "string") {
      const s = c.trim();
      if (!s) return null;
      if (looksLikeHttpUrl(s)) {
        const label = labelFromS3LogoUrl(s);
        const href = inferWebsiteFromLabel(label);
        return { kind: "img", logoUrl: s, href, alt: label || void 0 };
      }
      return { kind: "text", text: s, href: inferWebsiteFromLabel(s) };
    }
    return null;
  }).filter(Boolean);
};
var EndMarketHeadingPdf = ({
  title,
  tone
}) => /* @__PURE__ */ jsxs6(
  View7,
  {
    style: [styles6.emHeading, tone === "dark" ? styles6.emHeadingDark : null],
    wrap: false,
    children: [
      /* @__PURE__ */ jsx7(View7, { style: styles6.emHeadingLine }),
      /* @__PURE__ */ jsx7(
        Text7,
        {
          style: [
            styles6.emHeadingText,
            tone === "accent" ? styles6.emHeadingTextAccent : styles6.emHeadingTextDark
          ],
          children: title
        }
      ),
      /* @__PURE__ */ jsx7(View7, { style: styles6.emHeadingLine })
    ]
  }
);
var EndMarketCardPdf = ({
  em,
  width,
  citeCtx: citeCtx2
}) => {
  const bannerH = 44;
  const badgeS = 32;
  const title = em?.name || "";
  const badgeUrl = typeof em?.badgeUrl === "string" ? em.badgeUrl : "";
  const desc = typeof em?.description === "string" ? em.description : "";
  const useCase = typeof em?.key_use_case === "string" ? em.key_use_case : "";
  const clients = parseEndMarketClients(em?.key_clients);
  const padX = 8;
  const gapX = 8;
  const colW = (width - padX * 2 - gapX * 2) / 3;
  return /* @__PURE__ */ jsxs6(View7, { style: [styles6.emCard, { width }], wrap: false, children: [
    /* @__PURE__ */ jsxs6(View7, { style: [styles6.emBannerWrap, { height: bannerH }], wrap: false, children: [
      /* @__PURE__ */ jsx7(Text7, { style: styles6.emBannerTitle, wrap: true, children: renderInlineCitations5(title, citeCtx2) }),
      /* @__PURE__ */ jsx7(View7, { style: [styles6.emBadge, { width: badgeS, height: badgeS }], wrap: false, children: badgeUrl ? /* @__PURE__ */ jsx7(Image4, { src: badgeUrl, style: styles6.emBadgeImg }) : null })
    ] }),
    /* @__PURE__ */ jsxs6(View7, { style: styles6.emBody, children: [
      /* @__PURE__ */ jsx7(Text7, { style: styles6.emDesc, wrap: true, children: renderInlineCitations5(desc, citeCtx2) }),
      /* @__PURE__ */ jsx7(EndMarketHeadingPdf, { title: "Cas d'usage", tone: "accent" }),
      /* @__PURE__ */ jsx7(Text7, { style: styles6.emUseCase, wrap: true, children: renderInlineCitations5(useCase, citeCtx2) })
    ] }),
    /* @__PURE__ */ jsxs6(View7, { style: styles6.emClients, wrap: false, children: [
      /* @__PURE__ */ jsx7(EndMarketHeadingPdf, { title: "Clients", tone: "dark" }),
      /* @__PURE__ */ jsx7(View7, { style: styles6.emClientsGrid, children: clients.map((c, i) => {
        const key = `${em.name}-cli-${i}`;
        const cellStyle = [
          styles6.emClientCell,
          { width: colW, height: 30, marginLeft: i % 3 === 0 ? 0 : gapX }
        ];
        if (c.kind === "img") {
          const imgW = colW * 0.8;
          return /* @__PURE__ */ jsx7(View7, { style: cellStyle, wrap: false, children: /* @__PURE__ */ jsx7(
            Image4,
            {
              src: c.logoUrl,
              style: [styles6.emClientLogo, { width: imgW, height: 24 }]
            }
          ) }, key);
        }
        const pill = /* @__PURE__ */ jsx7(Text7, { style: styles6.emClientText, children: renderInlineCitations5(c.text, citeCtx2) });
        return /* @__PURE__ */ jsx7(View7, { style: cellStyle, wrap: false, children: pill }, key);
      }) })
    ] })
  ] });
};
var EndMarketsPdfBlock = ({
  data,
  citeCtx: citeCtx2
}) => {
  const endMarkets = Array.isArray(data?.end_markets) ? data.end_markets : [];
  if (!endMarkets.length) return null;
  const COLS = 3;
  const GAP = 12;
  const CARD_W = (CONTENT_W - GAP * (COLS - 1)) / COLS;
  const rows = [];
  for (let i = 0; i < endMarkets.length; i += COLS) {
    rows.push(endMarkets.slice(i, i + COLS));
  }
  return /* @__PURE__ */ jsxs6(View7, { style: styles6.emWrap, children: [
    /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: "March\xE9s finaux" }),
    rows.map((row, r) => /* @__PURE__ */ jsx7(View7, { style: styles6.emRow, wrap: false, children: Array.from({ length: COLS }).map((_, c) => {
      const em = row[c];
      if (!em) return /* @__PURE__ */ jsx7(View7, { style: { width: CARD_W } }, `em-empty-${r}-${c}`);
      return /* @__PURE__ */ jsx7(
        EndMarketCardPdf,
        {
          em,
          width: CARD_W,
          citeCtx: citeCtx2
        },
        `em-${r}-${c}`
      );
    }) }, `em-row-${r}`))
  ] });
};
var MarketPdfDocument = ({
  content
}) => {
  const marketObj = content || {};
  const citeCtx2 = createCiteCtx4();
  const presentation = marketObj?.Presentation ?? marketObj?.presentation;
  const valueChain = marketObj?.ValueChain ?? marketObj?.valueChain;
  const valueChainData = Array.isArray(valueChain) ? valueChain[0] : valueChain;
  const marketEcosystem = marketObj?.MarketEcosystem ?? marketObj?.marketEcosystem;
  const marketSizeGrowth = marketObj?.["MarketSize&Growth"] ?? marketObj?.marketSizeGrowth ?? marketObj?.marketSizeAndGrowth;
  const growthDrivers = marketObj?.GrowthDrivers ?? marketObj?.growthDrivers;
  const barriersObj = marketObj?.BarriersEntry ?? marketObj?.barrieres ?? marketObj?.barriers;
  const endMarkets = marketObj?.EndMarket && typeof marketObj.EndMarket === "object" ? marketObj.EndMarket : void 0;
  const structuredSections = Array.isArray(presentation?.sections) ? presentation.sections : Array.isArray(marketObj?.sections) ? marketObj.sections : null;
  const rootTitle = presentation?.rootTitle ?? marketObj?.rootTitle ?? presentation?.title;
  const renderSections = () => {
    if (!structuredSections?.length) return null;
    return /* @__PURE__ */ jsxs6(View7, { style: { marginBottom: 10 }, children: [
      rootTitle ? /* @__PURE__ */ jsx7(Text7, { style: styles6.h1, children: renderInlineCitations5(String(rootTitle), citeCtx2) }) : null,
      structuredSections.map((sec, secIdx) => {
        const subsections = Array.isArray(sec.subsections) ? sec.subsections : [];
        const firstSub = subsections[0];
        const firstImages = normalizeImages(firstSub?.images);
        const firstTextLines = firstSub?.text ? normalizeTextLines2(firstSub.text) : [];
        const firstCanInlineImage = firstTextLines.length > 0 && firstImages.length === 1;
        const inlineSectionTitle = Boolean(sec.title) && firstCanInlineImage;
        return /* @__PURE__ */ jsxs6(View7, { children: [
          !inlineSectionTitle && sec.title ? /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: renderInlineCitations5(String(sec.title), citeCtx2) }) : null,
          subsections.map((sub, subIdx) => {
            const images = normalizeImages(sub?.images);
            const textLines = sub.text ? normalizeTextLines2(sub.text) : [];
            const canInlineImage = textLines.length > 0 && images.length === 1;
            const { inlineLines, restLines } = splitInlineText(textLines);
            const includeSectionTitle = inlineSectionTitle && subIdx === 0;
            const headingMarginTop = includeSectionTitle ? H2_MARGIN_TOP : sub.subtitle ? SUBTITLE_MARGIN_TOP : INLINE_ROW_MARGIN_TOP2;
            const inlineRowStyle = [
              styles6.inlineMediaRow,
              { marginTop: headingMarginTop }
            ];
            const inlineImageColStyle = includeSectionTitle || sub.subtitle ? [styles6.inlineImageCol, { marginTop: 0 }] : styles6.inlineImageCol;
            return /* @__PURE__ */ jsx7(View7, { style: { marginBottom: 8 }, children: canInlineImage ? /* @__PURE__ */ jsxs6(Fragment2, { children: [
              /* @__PURE__ */ jsxs6(View7, { style: inlineRowStyle, wrap: false, children: [
                /* @__PURE__ */ jsxs6(View7, { style: styles6.inlineTextCol, children: [
                  includeSectionTitle ? /* @__PURE__ */ jsx7(Text7, { style: [styles6.h2, styles6.inlineHeading], children: renderInlineCitations5(String(sec.title), citeCtx2) }) : null,
                  sub.subtitle ? /* @__PURE__ */ jsx7(
                    Text7,
                    {
                      style: [
                        styles6.subtitle,
                        includeSectionTitle ? null : styles6.inlineHeading
                      ],
                      minPresenceAhead: 80,
                      children: renderInlineCitations5(String(sub.subtitle), citeCtx2)
                    }
                  ) : null,
                  renderTextLines(inlineLines, citeCtx2, {
                    keyPrefix: `p-${secIdx}-${subIdx}-inline`,
                    paragraphStyle: [styles6.paragraph, styles6.justifiedText],
                    bulletTextStyle: [styles6.bulletText, styles6.justifiedText]
                  })
                ] }),
                /* @__PURE__ */ jsxs6(View7, { style: inlineImageColStyle, wrap: false, children: [
                  /* @__PURE__ */ jsx7(Image4, { src: images[0].src, style: styles6.inlineImage }),
                  images[0].caption ? /* @__PURE__ */ jsx7(Text7, { style: styles6.figureCaption, children: renderInlineCitations5(images[0].caption, citeCtx2) }) : null
                ] })
              ] }),
              renderTextLines(restLines, citeCtx2, {
                keyPrefix: `p-rest-${secIdx}-${subIdx}`,
                paragraphStyle: [styles6.paragraph, styles6.justifiedText],
                bulletTextStyle: [styles6.bulletText, styles6.justifiedText]
              })
            ] }) : /* @__PURE__ */ jsxs6(Fragment2, { children: [
              sub.subtitle ? /* @__PURE__ */ jsx7(Text7, { style: styles6.subtitle, minPresenceAhead: 80, children: renderInlineCitations5(String(sub.subtitle), citeCtx2) }) : null,
              renderTextLines(textLines, citeCtx2, {
                keyPrefix: `p-${secIdx}-${subIdx}`,
                paragraphStyle: [styles6.paragraph, styles6.justifiedText],
                bulletTextStyle: [styles6.bulletText, styles6.justifiedText]
              }),
              /* @__PURE__ */ jsx7(
                ImageBlock,
                {
                  images,
                  styles: styles6,
                  renderCaption: (caption) => renderInlineCitations5(caption, citeCtx2)
                }
              )
            ] }) }, `sub-${secIdx}-${subIdx}`);
          }),
          secIdx < structuredSections.length - 1 ? /* @__PURE__ */ jsx7(View7, { style: styles6.divider }) : null
        ] }, `sec-${secIdx}`);
      })
    ] });
  };
  const renderFallback = () => {
    const rawText = typeof presentation?.presentation === "string" ? presentation.presentation : typeof marketObj?.presentation === "string" ? marketObj.presentation : typeof content === "string" ? content : "";
    const lines = normalizeTextLines2(rawText);
    if (!lines.length) return null;
    return /* @__PURE__ */ jsxs6(View7, { style: { marginBottom: 10 }, children: [
      rootTitle ? /* @__PURE__ */ jsx7(Text7, { style: styles6.h1, children: renderInlineCitations5(String(rootTitle), citeCtx2) }) : null,
      renderTextLines(lines, citeCtx2, {
        keyPrefix: "fb",
        paragraphStyle: [styles6.paragraph, styles6.justifiedText],
        bulletTextStyle: [styles6.bulletText, styles6.justifiedText]
      })
    ] });
  };
  const renderValueChain = () => {
    const vc = valueChainData;
    if (!vc?.steps?.length) return null;
    return /* @__PURE__ */ jsx7(ValueChainPdfBlock, { data: vc, citeCtx: citeCtx2 });
  };
  const renderEcosystem = (breakBefore) => {
    const eco = marketEcosystem;
    const hasSuppliers = (eco?.supplier_types?.length ?? 0) > 0;
    const hasClients = (eco?.client_types?.length ?? 0) > 0;
    if (!hasSuppliers && !hasClients) return null;
    const suppliers = Array.isArray(eco?.supplier_types) ? eco.supplier_types : [];
    const clients = Array.isArray(eco?.client_types) ? eco.client_types : [];
    const totalRows = Math.max(suppliers.length, clients.length, 1);
    const chunks = Math.ceil(totalRows / ME_MAX_ROWS_PER_PAGE);
    return /* @__PURE__ */ jsx7(Fragment2, { children: Array.from({ length: chunks }).map((_, idx) => {
      const start = idx * ME_MAX_ROWS_PER_PAGE;
      const end = start + ME_MAX_ROWS_PER_PAGE;
      const chunkSuppliers = suppliers.slice(start, end);
      const chunkClients = clients.slice(start, end);
      return /* @__PURE__ */ jsx7(View7, { break: idx === 0 ? breakBefore : true, children: /* @__PURE__ */ jsx7(
        MarketEcosystemPdfBlock,
        {
          data: eco,
          citeCtx: citeCtx2,
          suppliers: chunkSuppliers,
          clients: chunkClients
        }
      ) }, `eco-${idx}`);
    }) });
  };
  const renderDrivers = () => {
    const payload = growthDrivers;
    if (!(Array.isArray(payload?.drivers) && payload.drivers.length)) return null;
    return /* @__PURE__ */ jsx7(DriversFlowPdfBlock, { data: payload, citeCtx: citeCtx2 });
  };
  const barriersState = (() => {
    const items = Array.isArray(barriersObj?.barrieres) ? barriersObj.barrieres : Array.isArray(barriersObj?.barrieres?.items) ? barriersObj.barrieres.items : [];
    const root = barriersObj?.barrieres && typeof barriersObj.barrieres === "object" ? barriersObj.barrieres : barriersObj;
    if (!items.length) {
      return {
        block: null,
        layout: null,
        slots: null
      };
    }
    const payload = {
      center_logo_url: root?.center_logo_url ?? barriersObj?.center_logo_url,
      items,
      sources: root?.sources ?? barriersObj?.sources
    };
    const slots = BD_QUADS.map((_, i) => items[i] ?? null);
    const layout = computeBarrierLayout(slots);
    return {
      block: /* @__PURE__ */ jsx7(BarrieresDiagramPdfBlock, { data: payload, citeCtx: citeCtx2, layout }),
      layout,
      slots
    };
  })();
  const renderEndMarkets = () => {
    const payload = endMarkets && Array.isArray(endMarkets.end_markets) ? endMarkets.end_markets : void 0;
    if ((payload?.length ?? 0) === 0) return null;
    return /* @__PURE__ */ jsx7(EndMarketsPdfBlock, { data: { end_markets: payload }, citeCtx: citeCtx2 });
  };
  const formatUnitSuffix = (unit) => {
    if (!unit) return "";
    const normalized = String(unit);
    if (normalized === "%" || normalized.startsWith("%")) return normalized;
    return ` ${normalized}`;
  };
  const coerceNumberArray = (input) => {
    if (!Array.isArray(input)) return [];
    return input.map((v) => {
      const num = Number(v);
      return Number.isFinite(num) ? num : 0;
    });
  };
  const getLegacyChartEntry = (data) => {
    if (!data || typeof data !== "object") return null;
    if ("format" in data || "kpi" in data || "pie" in data || "xy_series" in data) {
      return null;
    }
    const keys = Object.keys(data);
    return keys.length ? data[keys[0]] : null;
  };
  const extractChartSeries = (chart) => {
    const data = chart?.data && typeof chart.data === "object" ? chart.data : null;
    const dataEntry = getLegacyChartEntry(data);
    const xySeries = data?.xy_series;
    const pie = data?.pie;
    const kpi = data?.kpi;
    const categories = Array.isArray(chart?.categories) ? chart.categories : Array.isArray(xySeries?.x) ? xySeries.x : Array.isArray(dataEntry?.categories) ? dataEntry.categories : Array.isArray(pie?.labels) ? pie.labels : [];
    const series = Array.isArray(xySeries?.series) ? xySeries.series.map((s) => ({
      name: typeof s?.name === "string" ? s.name : "S\xE9rie",
      values: coerceNumberArray(s?.values)
    })) : [];
    const values = series.length && series[0].values.length ? series[0].values : coerceNumberArray(
      Array.isArray(chart?.values) ? chart.values : Array.isArray(dataEntry?.values) ? dataEntry.values : []
    );
    const pieLabels = Array.isArray(pie?.labels) ? pie.labels : Array.isArray(dataEntry?.categories) ? dataEntry.categories : Array.isArray(chart?.categories) ? chart.categories : categories;
    const pieValues = Array.isArray(pie?.values) ? coerceNumberArray(pie.values) : values;
    const kpiLabel = kpi?.label ?? dataEntry?.label;
    const kpiValue = kpi?.value ?? dataEntry?.value ?? dataEntry?.valeur ?? chart?.value;
    const kpiCountry = dataEntry?.country;
    const kpiUnit = dataEntry?.unit;
    return {
      categories,
      values,
      series,
      pieLabels,
      pieValues,
      kpiLabel,
      kpiValue,
      kpiCountry,
      kpiUnit
    };
  };
  const renderMarketChart = (chart, chartIdx, compact = true) => {
    const chartType = String(chart?.chart_type ?? chart?.type ?? "").toLowerCase();
    const {
      categories,
      values,
      series,
      pieLabels,
      pieValues,
      kpiLabel,
      kpiValue,
      kpiCountry,
      kpiUnit
    } = extractChartSeries(chart);
    const chartCaption = chart?.title ?? chart?.subtitle ?? "";
    if (chartType === "bar_chart" || chartType === "bar") {
      if (!categories.length || !values.length) return null;
      const graph = {
        titre: chartCaption,
        sous_titre_graph: chartCaption,
        periode_annees: categories,
        valeurs_marche: values,
        cagr: Number.isFinite(chart?.cagr) ? { disponible: true, valeur: Number(chart.cagr) } : void 0
      };
      return /* @__PURE__ */ jsx7(
        BarChartPdf,
        {
          graph,
          compact
        },
        `chart-bar-${chartIdx}-${graph.titre || "chart"}`
      );
    }
    if (chartType === "stacked_bar" || chartType === "stacked") {
      const stackedSeries = series.length ? series : values.length ? [{ name: chartCaption || "S\xE9rie", values }] : [];
      if (!categories.length || !stackedSeries.length) return null;
      return /* @__PURE__ */ jsx7(
        StackedBarChartPdf,
        {
          data: {
            title: chartCaption,
            subtitle: chartCaption,
            categories,
            series: stackedSeries,
            unit: chart?.unit
          },
          compact
        },
        `chart-stacked-${chartIdx}-${chartCaption || "chart"}`
      );
    }
    if (chartType === "line_chart" || chartType === "line") {
      if (!categories.length || !values.length) return null;
      return /* @__PURE__ */ jsx7(
        LineChartPdf,
        {
          data: {
            title: chartCaption,
            categories,
            values,
            unit: chart?.unit
          },
          compact
        },
        `chart-line-${chartIdx}-${chartCaption || "chart"}`
      );
    }
    if (chartType === "pie_chart" || chartType === "pie") {
      if (!pieLabels.length || !pieValues.length) return null;
      return /* @__PURE__ */ jsx7(
        PieChartPdf,
        {
          data: {
            title: chartCaption,
            subtitle: chartCaption,
            categories: pieLabels,
            values: pieValues,
            unit: chart?.unit
          },
          compact
        },
        `chart-pie-${chartIdx}-${chart?.title || "chart"}`
      );
    }
    if (chartType === "metric_kpis" || chartType === "metric_kpi" || chartType === "metric" || chartType === "kpi") {
      const metricData = {
        title: chartCaption,
        subtitle: chartCaption,
        label: kpiLabel,
        country: kpiCountry,
        value: kpiValue,
        unit: chart?.unit ?? kpiUnit
      };
      return /* @__PURE__ */ jsx7(
        MetricKpiPdf,
        {
          data: metricData,
          compact
        },
        `chart-metric-${chartIdx}-${chart?.title || "chart"}`
      );
    }
    return null;
  };
  const renderMarketSize = () => {
    const structuredMarketSize = (() => {
      const raw = marketSizeGrowth;
      if (Array.isArray(raw)) return raw;
      if (raw && Array.isArray(raw.sections)) return [raw];
      return [];
    })().map((block) => {
      const sections = Array.isArray(block?.sections) ? block.sections.filter(Boolean) : [];
      return { ...block, sections };
    }).filter((block) => (block.sections?.length ?? 0) > 0 || !!block?.title);
    const hasStructuredContent = structuredMarketSize.length > 0;
    const rawPresentation = typeof marketSizeGrowth?.presentation === "string" ? marketSizeGrowth.presentation : typeof marketSizeGrowth === "string" ? marketSizeGrowth : "";
    const lines = normalizeTextLines2(rawPresentation);
    const hasLegacyContent = lines.length > 0;
    if (!hasStructuredContent && !hasLegacyContent) return null;
    return /* @__PURE__ */ jsxs6(View7, { style: { marginTop: 10 }, children: [
      /* @__PURE__ */ jsx7(Text7, { style: styles6.h2, children: "Taille du march\xE9 & croissance" }),
      hasStructuredContent && /* @__PURE__ */ jsx7(View7, { style: { marginTop: 8 }, children: structuredMarketSize.map((block, blockIdx) => /* @__PURE__ */ jsxs6(View7, { style: { marginBottom: 10 }, children: [
        block?.title && /* @__PURE__ */ jsx7(Text7, { style: [styles6.h2, { marginTop: blockIdx > 0 ? 10 : 0 }], children: renderInlineCitations5(String(block.title), citeCtx2) }),
        Array.isArray(block.sections) && block.sections.map((section, sectionIdx) => {
          const sectionContent = typeof section?.content === "string" ? section.content : typeof section?.text === "string" ? section.text : "";
          const subsections = Array.isArray(section?.subsections) ? section.subsections.filter(Boolean) : [];
          const hasSubsections = subsections.length > 0;
          const sectionCharts = Array.isArray(section?.charts) ? section.charts : [];
          const sectionGraphs = Array.isArray(section?.graphs) ? section.graphs : [];
          const hasSectionCharts = sectionCharts.length > 0 || sectionGraphs.length > 0;
          return /* @__PURE__ */ jsxs6(View7, { style: { marginBottom: 8 }, children: [
            hasSubsections && section?.title && /* @__PURE__ */ jsx7(Text7, { style: styles6.subtitle, children: renderInlineCitations5(String(section.title), citeCtx2) }),
            !hasSubsections && /* @__PURE__ */ jsxs6(View7, { style: { marginBottom: 6 }, children: [
              section?.title && /* @__PURE__ */ jsx7(Text7, { style: styles6.subtitle, children: renderInlineCitations5(String(section.title), citeCtx2) }),
              (() => {
                if (!hasSectionCharts) {
                  return sectionContent && renderTextLines(normalizeTextLines2(sectionContent), citeCtx2, {
                    keyPrefix: `ms-sec-${blockIdx}-${sectionIdx}`,
                    paragraphStyle: [styles6.paragraph, styles6.justifiedText]
                  });
                }
                const textLines = sectionContent ? normalizeTextLines2(sectionContent) : [];
                const { inlineLines, restLines } = splitInlineText(textLines);
                return /* @__PURE__ */ jsxs6(Fragment2, { children: [
                  /* @__PURE__ */ jsxs6(View7, { style: styles6.inlineMediaRow, wrap: false, children: [
                    /* @__PURE__ */ jsx7(View7, { style: styles6.inlineChartTextCol, children: renderTextLines(inlineLines, citeCtx2, {
                      keyPrefix: `ms-sec-${blockIdx}-${sectionIdx}-inline`,
                      paragraphStyle: [styles6.paragraph, styles6.justifiedText]
                    }) }),
                    /* @__PURE__ */ jsxs6(View7, { style: styles6.inlineChartCol, children: [
                      sectionCharts.map(
                        (chart, chartIdx) => renderMarketChart(chart, chartIdx)
                      ),
                      sectionGraphs.map(
                        (graph, graphIdx) => renderMarketChart(graph, graphIdx + sectionCharts.length)
                      )
                    ] })
                  ] }),
                  restLines.length > 0 && renderTextLines(restLines, citeCtx2, {
                    keyPrefix: `ms-sec-${blockIdx}-${sectionIdx}-rest`,
                    paragraphStyle: [styles6.paragraph, styles6.justifiedText]
                  })
                ] });
              })()
            ] }),
            subsections.map((sub, subIdx) => {
              const subContent = typeof sub?.content === "string" ? sub.content : typeof sub?.text === "string" ? sub.text : "";
              const subCharts = Array.isArray(sub?.charts) ? sub.charts : [];
              const subGraphs = Array.isArray(sub?.graphs) ? sub.graphs : [];
              const hasSubCharts = subCharts.length > 0 || subGraphs.length > 0;
              return /* @__PURE__ */ jsxs6(View7, { style: { marginBottom: 6 }, children: [
                sub?.title && /* @__PURE__ */ jsx7(Text7, { style: [styles6.subtitle, { fontSize: 7, textTransform: "uppercase" }], children: renderInlineCitations5(String(sub.title), citeCtx2) }),
                (() => {
                  if (!hasSubCharts) {
                    return subContent && renderTextLines(normalizeTextLines2(subContent), citeCtx2, {
                      keyPrefix: `ms-subsec-${blockIdx}-${sectionIdx}-${subIdx}`,
                      paragraphStyle: [styles6.paragraph, styles6.justifiedText]
                    });
                  }
                  const textLines = subContent ? normalizeTextLines2(subContent) : [];
                  const { inlineLines, restLines } = splitInlineText(textLines);
                  return /* @__PURE__ */ jsxs6(Fragment2, { children: [
                    /* @__PURE__ */ jsxs6(View7, { style: styles6.inlineMediaRow, wrap: false, children: [
                      /* @__PURE__ */ jsx7(View7, { style: styles6.inlineChartTextCol, children: renderTextLines(inlineLines, citeCtx2, {
                        keyPrefix: `ms-subsec-${blockIdx}-${sectionIdx}-${subIdx}-inline`,
                        paragraphStyle: [styles6.paragraph, styles6.justifiedText]
                      }) }),
                      /* @__PURE__ */ jsxs6(View7, { style: styles6.inlineChartCol, children: [
                        subCharts.map(
                          (chart, chartIdx) => renderMarketChart(chart, chartIdx)
                        ),
                        subGraphs.map(
                          (graph, graphIdx) => renderMarketChart(graph, graphIdx + subCharts.length)
                        )
                      ] })
                    ] }),
                    restLines.length > 0 && renderTextLines(restLines, citeCtx2, {
                      keyPrefix: `ms-subsec-${blockIdx}-${sectionIdx}-${subIdx}-rest`,
                      paragraphStyle: [styles6.paragraph, styles6.justifiedText]
                    })
                  ] });
                })()
              ] }, `ms-subsec-${blockIdx}-${sectionIdx}-${subIdx}`);
            })
          ] }, `ms-section-${blockIdx}-${sectionIdx}`);
        })
      ] }, `ms-block-${blockIdx}`)) }),
      hasLegacyContent && !hasStructuredContent && renderTextLines(lines, citeCtx2, { keyPrefix: "ms" })
    ] });
  };
  const sectionsBlock = renderSections() || renderFallback();
  const valueChainBlock = renderValueChain();
  const ecosystemBlock = renderEcosystem(Boolean(sectionsBlock || valueChainBlock));
  const driversBlock = renderDrivers();
  const barriersBlock = barriersState.block;
  const barriersLayout = barriersState.layout;
  const barriersSlots = barriersState.slots;
  const endMarketsBlock = renderEndMarkets();
  const marketSizeBlock = renderMarketSize();
  const shouldSplitRows = Boolean(
    barriersLayout && barriersLayout.coreHeight > BD_CORE_MAX_HEIGHT
  );
  const shouldSoloBarriers = Boolean(
    barriersLayout && (barriersLayout.maxCardHeight >= BD_CARD_LONG_THRESHOLD || shouldSplitRows)
  );
  const hasAfterBarriers = Boolean(endMarketsBlock);
  const barriersNode = barriersBlock ? shouldSplitRows && barriersSlots ? /* @__PURE__ */ jsxs6(Fragment2, { children: [
    /* @__PURE__ */ jsx7(View7, { break: true, children: /* @__PURE__ */ jsx7(BarrieresRowPdfBlock, { items: barriersSlots.slice(0, 2), citeCtx: citeCtx2, row: "top" }) }),
    /* @__PURE__ */ jsx7(View7, { break: true, children: /* @__PURE__ */ jsx7(
      BarrieresRowPdfBlock,
      {
        items: barriersSlots.slice(2, 4),
        citeCtx: citeCtx2,
        row: "bottom",
        titleSuffix: "(suite)"
      }
    ) }),
    hasAfterBarriers ? /* @__PURE__ */ jsx7(View7, { break: true }) : null
  ] }) : shouldSoloBarriers ? /* @__PURE__ */ jsxs6(Fragment2, { children: [
    /* @__PURE__ */ jsx7(View7, { break: true, children: barriersBlock }),
    hasAfterBarriers ? /* @__PURE__ */ jsx7(View7, { break: true }) : null
  ] }) : barriersBlock : null;
  const hasAnyContent = Boolean(
    sectionsBlock || valueChainBlock || ecosystemBlock || driversBlock || barriersBlock || endMarketsBlock || marketSizeBlock
  );
  return /* @__PURE__ */ jsx7(Document5, { children: /* @__PURE__ */ jsxs6(Page5, { size: "A4", style: styles6.page, wrap: true, children: [
    /* @__PURE__ */ jsx7(SectionNav_default, { active: "March\xE9" }),
    sectionsBlock,
    marketSizeBlock,
    driversBlock,
    valueChainBlock,
    ecosystemBlock,
    barriersNode,
    endMarketsBlock,
    !hasAnyContent && /* @__PURE__ */ jsx7(Text7, { style: styles6.paragraph, children: "Aucun contenu march\xE9." })
  ] }) });
};
var MarketPdfDocument_default = MarketPdfDocument;

// src/two-pager/pdf/competitors/CompetitorsPdfDocument.tsx
import { Document as Document6, Page as Page6, Text as Text8, View as View8, StyleSheet as StyleSheet7, Image as Image5, Link as Link6 } from "@react-pdf/renderer";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var palette7 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280"
};
var styles7 = StyleSheet7.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette7.text,
    lineHeight: 1.4,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: palette7.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: palette7.text
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette7.primaryMuted,
    color: palette7.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  pageTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10
  },
  table: {
    borderWidth: 1,
    borderColor: palette7.border,
    borderRadius: 10,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: palette7.border
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette7.border
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    color: palette7.text
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8,
    color: palette7.text,
    lineHeight: 1.4
  },
  tdCell: {
    paddingVertical: 8,
    paddingHorizontal: 8
  },
  tdText: {
    fontSize: 8,
    color: palette7.text,
    lineHeight: 1.4,
    flexShrink: 1
  },
  colActor: { width: "24%" },
  colYear: { width: "10%" },
  colCountry: { width: "13%" },
  colOwnership: { width: "13%" },
  colProducts: { width: "40%" },
  actorCell: { flexDirection: "row", alignItems: "flex-start", minWidth: 0 },
  logo: {
    width: 22,
    height: 22,
    marginRight: 8,
    borderRadius: 6,
    objectFit: "contain",
    flexShrink: 0
  },
  logoFallback: {
    width: 22,
    height: 22,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette7.border,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center"
  },
  logoInitials: { fontSize: 8, color: palette7.muted, fontWeight: 700 },
  nameWrap: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0
  },
  name: {
    fontSize: 8,
    fontWeight: 700,
    flexShrink: 1,
    width: "100%"
  },
  countryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
  countryItem: {
    width: "50%",
    paddingBottom: 4
  },
  countryFlag: {
    width: 14,
    height: 10,
    borderRadius: 2,
    marginRight: 4,
    objectFit: "cover"
  },
  muted: { color: palette7.muted },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette7.muted,
    textDecoration: "none"
  }
});
var pick = (...vals) => vals.map((v) => v === null || v === void 0 ? "" : String(v).trim()).filter(Boolean)[0] || "\u2014";
var createCiteCtx5 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber6 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY6 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations6 = (raw, ctx) => {
  LINK_ANY6.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY6.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber6(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs7(Link6, { src: url, style: styles7.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var pickName = (c) => pick(c.competitor_name, c.company_name, c.name, c.actor);
var pickYear = (c) => pick(c.annee_de_creation, c.annee, c.year);
var pickOwnership = (c) => pick(c.actionnariat);
var pickProducts = (c) => pick(
  c.produits_et_services,
  c.produits_services,
  c.description,
  c.bio,
  c.commentaire
);
var CompetitorsPdfDocument = ({
  competitors = []
}) => {
  const rows = Array.isArray(competitors) ? competitors : [];
  const citeCtx2 = createCiteCtx5();
  return /* @__PURE__ */ jsx8(Document6, { children: /* @__PURE__ */ jsxs7(Page6, { size: "A4", style: styles7.page, children: [
    /* @__PURE__ */ jsx8(SectionNav_default, { active: "Concurrents" }),
    /* @__PURE__ */ jsx8(Text8, { style: styles7.pageTitle, children: "Concurrents" }),
    /* @__PURE__ */ jsxs7(View8, { style: styles7.table, children: [
      /* @__PURE__ */ jsxs7(View8, { style: styles7.tableHeader, children: [
        /* @__PURE__ */ jsx8(Text8, { style: [styles7.th, styles7.colActor], children: "Acteur" }),
        /* @__PURE__ */ jsx8(Text8, { style: [styles7.th, styles7.colYear], children: "Ann\xE9e" }),
        /* @__PURE__ */ jsx8(Text8, { style: [styles7.th, styles7.colCountry], children: "Localisation" }),
        /* @__PURE__ */ jsx8(Text8, { style: [styles7.th, styles7.colOwnership], children: "Actionnariat" }),
        /* @__PURE__ */ jsx8(Text8, { style: [styles7.th, styles7.colProducts], children: "Produits / services" })
      ] }),
      rows.length ? rows.map((c, idx) => {
        const name = pickName(c);
        const initials = name.split(/\s+/).map((p) => p[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
        const logoSrc = c?.logoDataUrl || (typeof c?.logo === "string" && c.logo.trim() ? c.logo.trim() : null) || (typeof c?.logo_url === "string" && c.logo_url.trim() ? c.logo_url.trim() : null) || (typeof c?.logoUrl === "string" && c.logoUrl.trim() ? c.logoUrl.trim() : null);
        const flags = Array.isArray(c.countryFlags) ? c.countryFlags : [];
        const flagItems = flags.filter((f) => f.src);
        return /* @__PURE__ */ jsxs7(View8, { style: styles7.tableRow, wrap: false, children: [
          /* @__PURE__ */ jsxs7(View8, { style: [styles7.td, styles7.colActor, styles7.actorCell], children: [
            logoSrc ? /* @__PURE__ */ jsx8(Image5, { src: logoSrc, style: styles7.logo }) : /* @__PURE__ */ jsx8(View8, { style: styles7.logoFallback, children: /* @__PURE__ */ jsx8(Text8, { style: styles7.logoInitials, children: initials || "\u2014" }) }),
            /* @__PURE__ */ jsx8(View8, { style: styles7.nameWrap, children: /* @__PURE__ */ jsx8(Text8, { style: styles7.name, children: renderInlineCitations6(name, citeCtx2) }) })
          ] }),
          /* @__PURE__ */ jsx8(Text8, { style: [styles7.td, styles7.colYear], children: renderInlineCitations6(pickYear(c), citeCtx2) }),
          /* @__PURE__ */ jsx8(View8, { style: [styles7.tdCell, styles7.colCountry], children: flagItems.length ? /* @__PURE__ */ jsx8(View8, { style: styles7.countryGrid, children: flagItems.map((flag, flagIdx) => /* @__PURE__ */ jsx8(View8, { style: styles7.countryItem, children: /* @__PURE__ */ jsx8(Image5, { src: flag.src, style: styles7.countryFlag }) }, `comp-${idx}-flag-${flagIdx}`)) }) : /* @__PURE__ */ jsx8(Text8, { style: styles7.tdText, children: "\u2014" }) }),
          /* @__PURE__ */ jsx8(Text8, { style: [styles7.td, styles7.colOwnership], children: renderInlineCitations6(pickOwnership(c), citeCtx2) }),
          /* @__PURE__ */ jsx8(Text8, { style: [styles7.td, styles7.colProducts], children: renderInlineCitations6(pickProducts(c), citeCtx2) })
        ] }, `comp-${idx}`);
      }) : /* @__PURE__ */ jsx8(View8, { style: styles7.tableRow, children: /* @__PURE__ */ jsx8(Text8, { style: [styles7.td, { width: "100%", textAlign: "center" }], children: "Aucun concurrent." }) })
    ] })
  ] }) });
};
var CompetitorsPdfDocument_default = CompetitorsPdfDocument;

// src/two-pager/pdf/insights/NaviiaInsightsPdfDocument.tsx
import { Document as Document7, Page as Page7, Text as Text9, View as View9, StyleSheet as StyleSheet8, Link as Link7 } from "@react-pdf/renderer";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var palette8 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  riskText: "#B91C1C",
  oppText: "#15803D"
};
var styles8 = StyleSheet8.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette8.text,
    lineHeight: 1.4,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: palette8.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: { flex: 1, minWidth: 0 },
  title: { fontSize: 17, fontWeight: 700, color: palette8.text },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette8.primaryMuted,
    color: palette8.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6 },
  table: {
    borderWidth: 1,
    borderColor: palette8.border,
    borderRadius: 10,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: palette8.border
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette8.border
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    color: palette8.text
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8,
    color: palette8.text,
    lineHeight: 1.4
  },
  titleCellRisk: {
    color: palette8.riskText,
    fontWeight: 700
  },
  titleCellOpportunity: {
    color: palette8.oppText,
    fontWeight: 700
  },
  colTitle: { width: "26%" },
  colImpact: { width: "37%" },
  colProb: { width: "37%" },
  bullet: { width: 6, fontSize: 8, color: palette8.muted },
  bulletText: { flex: 1, fontSize: 8, color: palette8.text },
  muted: { color: palette8.muted },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette8.muted,
    textDecoration: "none"
  }
});
var createCiteCtx6 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber7 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY7 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations7 = (raw, ctx) => {
  LINK_ANY7.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY7.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber7(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs8(Link7, { src: url, style: styles8.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var renderList = (lines, citeCtx2) => {
  if (!lines.length) return /* @__PURE__ */ jsx9(Text9, { style: styles8.muted, children: "\u2014" });
  return /* @__PURE__ */ jsx9(View9, { children: lines.map((line, idx) => /* @__PURE__ */ jsxs8(View9, { style: { flexDirection: "row", alignItems: "flex-start", marginBottom: 2 }, children: [
    /* @__PURE__ */ jsx9(Text9, { style: styles8.bullet, children: "\u2022" }),
    /* @__PURE__ */ jsx9(Text9, { style: styles8.bulletText, wrap: true, children: renderInlineCitations7(line, citeCtx2) })
  ] }, idx)) });
};
var renderTable = (title, items, tone, citeCtx2) => {
  const titleToneStyle = tone === "risk" ? styles8.titleCellRisk : styles8.titleCellOpportunity;
  return /* @__PURE__ */ jsxs8(View9, { style: styles8.section, children: [
    /* @__PURE__ */ jsx9(Text9, { style: styles8.sectionTitle, children: title }),
    /* @__PURE__ */ jsxs8(View9, { style: styles8.table, children: [
      /* @__PURE__ */ jsxs8(View9, { style: styles8.tableHeader, children: [
        /* @__PURE__ */ jsx9(Text9, { style: [styles8.th, styles8.colTitle], children: "Titre" }),
        /* @__PURE__ */ jsx9(Text9, { style: [styles8.th, styles8.colImpact], children: "Impact sur l'entreprise" }),
        /* @__PURE__ */ jsx9(Text9, { style: [styles8.th, styles8.colProb], children: "Probabilit\xE9" })
      ] }),
      items.length ? items.map((it, idx) => /* @__PURE__ */ jsxs8(View9, { style: styles8.tableRow, wrap: false, children: [
        /* @__PURE__ */ jsx9(Text9, { style: [styles8.td, styles8.colTitle, titleToneStyle], children: renderInlineCitations7(it.title || "\u2014", citeCtx2) }),
        /* @__PURE__ */ jsx9(View9, { style: [styles8.td, styles8.colImpact], children: renderList(it.impact, citeCtx2) }),
        /* @__PURE__ */ jsx9(View9, { style: [styles8.td, styles8.colProb], children: renderList(it.probability, citeCtx2) })
      ] }, `${title}-${idx}`)) : /* @__PURE__ */ jsx9(View9, { style: styles8.tableRow, children: /* @__PURE__ */ jsx9(Text9, { style: [styles8.td, { width: "100%", textAlign: "center" }], children: "Aucune donn\xE9e." }) })
    ] })
  ] });
};
var NaviiaInsightsPdfDocument = ({
  risks,
  opportunities
}) => {
  const citeCtx2 = createCiteCtx6();
  return /* @__PURE__ */ jsx9(Document7, { children: /* @__PURE__ */ jsxs8(Page7, { size: "A4", style: styles8.page, children: [
    /* @__PURE__ */ jsx9(SectionNav_default, { active: "Insights" }),
    renderTable("Risques", risks, "risk", citeCtx2),
    renderTable("Opportunit\xE9s", opportunities, "opportunity", citeCtx2)
  ] }) });
};
var NaviiaInsightsPdfDocument_default = NaviiaInsightsPdfDocument;

// src/two-pager/pdf/notes/NotesPdfDocument.tsx
import { Document as Document8, Page as Page8, Text as Text10, View as View10, StyleSheet as StyleSheet9, Link as Link8 } from "@react-pdf/renderer";
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var palette9 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280"
};
var styles9 = StyleSheet9.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette9.text,
    lineHeight: 1.4,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette9.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: { flex: 1, minWidth: 0 },
  title: { fontSize: 17, fontWeight: 700, color: palette9.text },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette9.primaryMuted,
    color: palette9.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    color: palette9.text
  },
  table: {
    borderWidth: 1,
    borderColor: palette9.border,
    borderRadius: 10,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: palette9.border
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette9.border
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    color: palette9.text
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8,
    color: palette9.text,
    lineHeight: 1.4
  },
  colTitre: { width: "55%" },
  colSource: { width: "25%" },
  colLien: { width: "20%" },
  muted: { color: palette9.muted },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette9.muted,
    textDecoration: "none"
  }
});
var pick2 = (...vals) => vals.map((v) => v === null || v === void 0 ? "" : String(v).trim()).filter(Boolean)[0] || "\u2014";
var createCiteCtx7 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber8 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY8 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations8 = (raw, ctx) => {
  LINK_ANY8.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY8.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber8(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs9(Link8, { src: url, style: styles9.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var NotesPdfDocument = ({ reports = [] }) => {
  const rows = Array.isArray(reports) ? reports : [];
  const citeCtx2 = createCiteCtx7();
  return /* @__PURE__ */ jsx10(Document8, { children: /* @__PURE__ */ jsxs9(Page8, { size: "A4", style: styles9.page, children: [
    /* @__PURE__ */ jsx10(SectionNav_default, { active: "Notes" }),
    /* @__PURE__ */ jsx10(Text10, { style: styles9.sectionTitle, children: "Notes de march\xE9" }),
    /* @__PURE__ */ jsxs9(View10, { style: styles9.table, children: [
      /* @__PURE__ */ jsxs9(View10, { style: styles9.tableHeader, children: [
        /* @__PURE__ */ jsx10(Text10, { style: [styles9.th, styles9.colTitre], children: "Titre" }),
        /* @__PURE__ */ jsx10(Text10, { style: [styles9.th, styles9.colSource], children: "Source" }),
        /* @__PURE__ */ jsx10(Text10, { style: [styles9.th, styles9.colLien], children: "Lien" })
      ] }),
      rows.length ? rows.map((r, idx) => /* @__PURE__ */ jsxs9(View10, { style: styles9.tableRow, wrap: false, children: [
        /* @__PURE__ */ jsx10(Text10, { style: [styles9.td, styles9.colTitre], children: renderInlineCitations8(pick2(r.titre), citeCtx2) }),
        /* @__PURE__ */ jsx10(Text10, { style: [styles9.td, styles9.colSource], children: renderInlineCitations8(pick2(r.source), citeCtx2) }),
        /* @__PURE__ */ jsx10(Text10, { style: [styles9.td, styles9.colLien], children: r.lien ? renderInlineCitations8(r.lien, citeCtx2) : /* @__PURE__ */ jsx10(Text10, { style: styles9.muted, children: "\u2014" }) })
      ] }, `note-${idx}`)) : /* @__PURE__ */ jsx10(View10, { style: styles9.tableRow, children: /* @__PURE__ */ jsx10(Text10, { style: [styles9.td, { width: "100%", textAlign: "center" }], children: "Aucune note de march\xE9." }) })
    ] })
  ] }) });
};
var NotesPdfDocument_default = NotesPdfDocument;

// src/two-pager/pdf/deals/DealsPdfDocument.tsx
import { Document as Document9, Page as Page9, Text as Text11, View as View11, StyleSheet as StyleSheet10, Link as Link9 } from "@react-pdf/renderer";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var palette10 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280"
};
var styles10 = StyleSheet10.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette10.text,
    lineHeight: 1.4,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: palette10.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: { flex: 1, minWidth: 0 },
  title: { fontSize: 17, fontWeight: 700, color: palette10.text },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette10.primaryMuted,
    color: palette10.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  pageTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10
  },
  table: {
    borderWidth: 1,
    borderColor: palette10.border,
    borderRadius: 10,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: palette10.border
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette10.border
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    color: palette10.text
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8,
    color: palette10.text,
    lineHeight: 1.4
  },
  colDate: { width: "12%" },
  colCountry: { width: "6%" },
  colTarget: { width: "18%" },
  colBuyer: { width: "18%" },
  colType: { width: "12%" },
  colDesc: { width: "34%" },
  muted: { color: palette10.muted },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette10.muted,
    textDecoration: "none"
  }
});
var pick3 = (...vals) => vals.map((v) => v === null || v === void 0 ? "" : String(v).trim()).filter(Boolean)[0] || "\u2014";
var createCiteCtx8 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber9 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY9 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations9 = (raw, ctx) => {
  LINK_ANY9.lastIndex = 0;
  const rawText = raw ?? "";
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY9.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber9(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs10(Link9, { src: url, style: styles10.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var normalizeDealText = (val, fallback = "\u2014") => {
  if (val === null || val === void 0) return fallback;
  const s = String(val).trim();
  return s ? s : fallback;
};
var DealsPdfDocument = ({ deals = [] }) => {
  const rows = Array.isArray(deals) ? deals : [];
  const citeCtx2 = createCiteCtx8();
  return /* @__PURE__ */ jsx11(Document9, { children: /* @__PURE__ */ jsxs10(Page9, { size: "A4", style: styles10.page, children: [
    /* @__PURE__ */ jsx11(SectionNav_default, { active: "Deals" }),
    /* @__PURE__ */ jsx11(Text11, { style: styles10.pageTitle, children: "Deals" }),
    /* @__PURE__ */ jsxs10(View11, { style: styles10.table, children: [
      /* @__PURE__ */ jsxs10(View11, { style: styles10.tableHeader, children: [
        /* @__PURE__ */ jsx11(Text11, { style: [styles10.th, styles10.colDate], children: "Date" }),
        /* @__PURE__ */ jsx11(Text11, { style: [styles10.th, styles10.colCountry], children: "Pays" }),
        /* @__PURE__ */ jsx11(Text11, { style: [styles10.th, styles10.colTarget], children: "Cible" }),
        /* @__PURE__ */ jsx11(Text11, { style: [styles10.th, styles10.colBuyer], children: "Acqu\xE9reur" }),
        /* @__PURE__ */ jsx11(Text11, { style: [styles10.th, styles10.colType], children: "Type" }),
        /* @__PURE__ */ jsx11(Text11, { style: [styles10.th, styles10.colDesc], children: "Description" })
      ] }),
      rows.length ? rows.map((d, idx) => {
        const descText = normalizeDealText(d.description);
        return /* @__PURE__ */ jsxs10(View11, { style: styles10.tableRow, wrap: false, children: [
          /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, styles10.colDate], children: renderInlineCitations9(pick3(d.date), citeCtx2) }),
          /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, styles10.colCountry], children: renderInlineCitations9(pick3(d.pays, d.country), citeCtx2) }),
          /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, styles10.colTarget], children: renderInlineCitations9(pick3(d.cible), citeCtx2) }),
          /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, styles10.colBuyer], children: renderInlineCitations9(pick3(d.acquereur), citeCtx2) }),
          /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, styles10.colType], children: renderInlineCitations9(
            pick3(d.type_acquisition, d.type),
            citeCtx2
          ) }),
          /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, styles10.colDesc], children: renderInlineCitations9(descText, citeCtx2) })
        ] }, `deal-${idx}`);
      }) : /* @__PURE__ */ jsx11(View11, { style: styles10.tableRow, children: /* @__PURE__ */ jsx11(Text11, { style: [styles10.td, { width: "100%", textAlign: "center" }], children: "Aucun deal." }) })
    ] })
  ] }) });
};
var DealsPdfDocument_default = DealsPdfDocument;

// src/two-pager/pdf/articles/ArticlesPdfDocument.tsx
import { Document as Document10, Page as Page10, Text as Text12, View as View12, StyleSheet as StyleSheet11, Link as Link10 } from "@react-pdf/renderer";
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var palette11 = {
  primary: "#4338CA",
  primaryMuted: "#EEF2FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280"
};
var styles11 = StyleSheet11.create({
  page: {
    padding: 48,
    paddingTop: 96,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: palette11.text,
    lineHeight: 1.4,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: palette11.border,
    borderRadius: 10,
    backgroundColor: "#ffffff"
  },
  titleGroup: { flex: 1, minWidth: 0 },
  title: { fontSize: 17, fontWeight: 700, color: palette11.text },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  pill: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: palette11.primaryMuted,
    color: palette11.primary,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1
  },
  pageTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10
  },
  list: {
    marginTop: 6,
    gap: 8
  },
  articleCard: {
    borderWidth: 1,
    borderColor: palette11.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff"
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 6
  },
  articleTitle: { fontSize: 11, fontWeight: 700, color: palette11.text, flex: 1 },
  articleDate: { fontSize: 8, color: palette11.muted, marginLeft: 8, textAlign: "right" },
  articleSource: { fontSize: 8, color: palette11.muted, marginTop: 4 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 4 },
  tag: {
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: palette11.primaryMuted,
    color: palette11.primary
  },
  articleBody: { marginTop: 6, fontSize: 8, color: palette11.text, lineHeight: 1.5 },
  citation: {
    fontSize: 8,
    fontWeight: 700,
    color: palette11.muted,
    textDecoration: "none"
  },
  empty: {
    borderWidth: 1,
    borderColor: palette11.border,
    borderRadius: 10,
    padding: 12,
    textAlign: "center",
    color: palette11.muted
  }
});
var pick4 = (...vals) => vals.map((v) => v === null || v === void 0 ? "" : String(v).trim()).filter(Boolean)[0] || "\u2014";
var createCiteCtx9 = () => ({ map: /* @__PURE__ */ new Map(), next: 1 });
var citeNumber10 = (ctx, url) => {
  const u = url.trim();
  const existing = ctx.map.get(u);
  if (existing) return existing;
  const n = ctx.next++;
  ctx.map.set(u, n);
  return n;
};
var LINK_ANY10 = /\[([^\]]+)\]\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|\(([^)]+)\)\(((?:https?:\/\/|www\.|mailto:)[^\s)]+)\)|((?:https?:\/\/|www\.|mailto:)[^\s)]+)/g;
var renderInlineCitations10 = (raw, ctx) => {
  LINK_ANY10.lastIndex = 0;
  const rawText = String(raw ?? "");
  const out = [];
  let last = 0;
  let m;
  while (m = LINK_ANY10.exec(rawText)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(sanitizePdfText(rawText.slice(last, idx)));
    const url = (m[2] ?? m[4] ?? m[5] ?? "").trim();
    if (url) {
      const n = citeNumber10(ctx, url);
      out.push(
        /* @__PURE__ */ jsxs11(Link10, { src: url, style: styles11.citation, children: [
          "[",
          n,
          "]"
        ] }, `cite-${n}-${idx}-${url}`)
      );
    }
    last = idx + m[0].length;
  }
  if (last < rawText.length) out.push(sanitizePdfText(rawText.slice(last)));
  return out;
};
var normalizeBody = (value) => {
  if (value === null || value === void 0) return "";
  return String(value).trim();
};
var formatDate = (val) => {
  if (!val) return "";
  const parsed = new Date(val);
  if (Number.isNaN(parsed.getTime())) return val;
  try {
    return parsed.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return parsed.toISOString().slice(0, 10);
  }
};
var splitTags = (val) => {
  if (!val) return [];
  return val.split("/").map((s) => s.trim()).filter(Boolean);
};
var ArticlesPdfDocument = ({
  articles = []
}) => {
  const rows = Array.isArray(articles) ? articles : [];
  const citeCtx2 = createCiteCtx9();
  return /* @__PURE__ */ jsx12(Document10, { children: /* @__PURE__ */ jsxs11(Page10, { size: "A4", style: styles11.page, children: [
    /* @__PURE__ */ jsx12(SectionNav_default, { active: "Press" }),
    /* @__PURE__ */ jsx12(Text12, { style: styles11.pageTitle, children: "Revue de presse" }),
    /* @__PURE__ */ jsx12(View12, { style: styles11.list, children: rows.length ? rows.map((a, idx) => {
      const date = formatDate(a.date_de_publication);
      const tags = splitTags(a.characteristics);
      const body = normalizeBody(a.resume);
      return /* @__PURE__ */ jsxs11(View12, { style: styles11.articleCard, wrap: false, children: [
        /* @__PURE__ */ jsxs11(View12, { style: styles11.articleHeader, children: [
          /* @__PURE__ */ jsx12(Text12, { style: styles11.articleTitle, children: renderInlineCitations10(pick4(a.title, a.titre), citeCtx2) }),
          date ? /* @__PURE__ */ jsx12(Text12, { style: styles11.articleDate, children: date }) : null
        ] }),
        /* @__PURE__ */ jsx12(Text12, { style: styles11.articleSource, children: renderInlineCitations10(pick4(a.source), citeCtx2) }),
        tags.length ? /* @__PURE__ */ jsx12(View12, { style: styles11.tagWrap, children: tags.map((t, i) => /* @__PURE__ */ jsx12(Text12, { style: styles11.tag, children: renderInlineCitations10(t, citeCtx2) }, `${t}-${i}`)) }) : null,
        body ? /* @__PURE__ */ jsx12(Text12, { style: styles11.articleBody, children: renderInlineCitations10(body, citeCtx2) }) : null,
        a.lien ? /* @__PURE__ */ jsx12(Text12, { style: styles11.articleBody, children: renderInlineCitations10(a.lien, citeCtx2) }) : null
      ] }, `article-${idx}`);
    }) : /* @__PURE__ */ jsx12(Text12, { style: styles11.empty, children: "Aucun article." }) })
  ] }) });
};
var ArticlesPdfDocument_default = ArticlesPdfDocument;

// src/two-pager/images.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// src/two-pager/utils/brand.ts
var BRANDFETCH_CLIENT_ID = process.env.BRANDFETCH_CLIENT_ID || "1ideKSoI3amykT1BU1x";
function getBrandfetchCdnLogo(domain) {
  if (!domain) return null;
  const clean = domain.replace(/^https?:\/\//i, "").replace(/^www\./i, "").trim();
  if (!clean) return null;
  return `https://cdn.brandfetch.io/${encodeURIComponent(clean)}?c=${BRANDFETCH_CLIENT_ID}`;
}
async function imageLoads(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    return contentType.startsWith("image/");
  } catch {
    return false;
  }
}
async function tryBrandfetchCdn(domain) {
  const cdnUrl = getBrandfetchCdnLogo(domain);
  if (!cdnUrl) return null;
  const ok = await imageLoads(cdnUrl);
  return ok ? cdnUrl : null;
}
function pickBrandfetchLogo(data) {
  const logos = Array.isArray(data?.logos) ? data.logos : [];
  for (const logo of logos) {
    const formats = Array.isArray(logo?.formats) ? logo.formats : [];
    const vector = formats.find((f) => f?.format === "svg" || f?.type === "vector");
    if (vector?.src || vector?.url) return vector.src || vector.url;
    const raster = formats.find((f) => f?.src || f?.url);
    if (raster?.src || raster?.url) return raster.src || raster.url;
  }
  if (data?.icon) return data.icon;
  if (typeof data?.logo === "string") return data.logo;
  return null;
}

// src/two-pager/utils/format.ts
function isString(val) {
  return typeof val === "string";
}
function sanitizeText(val) {
  return val.replace(/\\n/g, "\n");
}
function getValidLinkedinUrl(val) {
  if (!isString(val)) return null;
  const v = val.trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    if (!/^https?:$/i.test(u.protocol)) return null;
    if (!/(^|\.)linkedin\.com$/i.test(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}
function getDomainFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// src/two-pager/constants/countryCodes.ts
var COUNTRY_CODES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AX", name: "\xC5land Islands" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic of the" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "C\xF4te d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CW", name: "Cura\xE7ao" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and McDonald Islands" },
  { code: "VA", name: "Holy See" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea (Democratic People's Republic of)" },
  { code: "KR", name: "Korea (Republic of)" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia (Federated States of)" },
  { code: "MD", name: "Moldova, Republic of" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MK", name: "North Macedonia" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine, State of" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "R\xE9union" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "Saint Barth\xE9lemy" },
  { code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin (French part)" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten (Dutch part)" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania, United Republic of" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "T\xFCrkiye" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "US", name: "United States of America" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "VG", name: "Virgin Islands (British)" },
  { code: "VI", name: "Virgin Islands (U.S.)" },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
];
var COUNTRY_CODE_VALUES = COUNTRY_CODES.map((c) => c.code);

// src/two-pager/utils/country.ts
function normalizeCountryName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s]/g, "").trim();
}
var CUSTOM_COUNTRY_MAP = {
  allemagne: "DE",
  france: "FR",
  espagne: "ES",
  espana: "ES",
  luxembourg: "LU",
  algerie: "DZ",
  bulgarie: "BG",
  croatie: "HR",
  portugal: "PT",
  italie: "IT",
  "royaume uni": "GB",
  royaume_uni: "GB",
  royaumuni: "GB",
  uk: "GB",
  grande_bretagne: "GB",
  "etats unis": "US",
  etats_unis: "US",
  etatsunis: "US",
  usa: "US",
  chine: "CN",
  taiwan: "TW",
  taiwanprovinceofchina: "TW",
  singapour: "SG",
  singapore: "SG",
  australie: "AU",
  canada: "CA",
  autriche: "AT",
  bresil: "BR",
  brazil: "BR",
  "pays bas": "NL",
  pays_bas: "NL",
  paysbas: "NL",
  "republique tcheque": "CZ",
  republique_tcheque: "CZ",
  egypte: "EG",
  estonie: "EE",
  grece: "GR",
  iran: "IR",
  indonesie: "ID",
  indonesia: "ID",
  koweit: "KW",
  coree_du_sud: "KR",
  "coree du sud": "KR",
  coree_sud: "KR",
  coree: "KR",
  kirghizistan: "KG",
  libye: "LY",
  lituanie: "LT",
  "macedoine du nord": "MK",
  macedoine_du_nord: "MK",
  malte: "MT",
  maurice: "MU",
  chypre: "CY",
  cambodge: "KH",
  cambodia: "KH",
  cameroun: "CM",
  pologne: "PL",
  republique_du_congo: "CG",
  "republique du congo": "CG",
  roumanie: "RO",
  serbie: "RS",
  thailande: "TH",
  thailand: "TH",
  syrie: "SY",
  belgique: "BE",
  suisse: "CH",
  suede: "SE",
  finlande: "FI",
  norvege: "NO",
  mongolie: "MN",
  danemark: "DK",
  tchequie: "CZ",
  tcheque: "CZ",
  japon: "JP",
  inde: "IN",
  moldavie: "MD",
  guinee: "GN",
  irlande: "IE",
  mexique: "MX",
  argentine: "AR",
  chili: "CL",
  hongrie: "HU",
  emirats_arabes_unis: "AE",
  emirats: "AE",
  arabie_saoudite: "SA",
  "arabie saoudite": "SA",
  afrique_du_sud: "ZA",
  "afrique du sud": "ZA",
  turquie: "TR",
  maroc: "MA",
  tunisie: "TN",
  israel: "IL",
  russie: "RU",
  royaumeuni: "GB",
  etatsunisda: "US"
};
var ISO3_TO_ISO2 = {
  FRA: "FR",
  DEU: "DE",
  ESP: "ES",
  ITA: "IT",
  USA: "US",
  GBR: "GB",
  CHE: "CH",
  BEL: "BE",
  LUX: "LU",
  PRT: "PT",
  NLD: "NL",
  SWE: "SE",
  NOR: "NO",
  DNK: "DK",
  FIN: "FI",
  IRL: "IE",
  CAN: "CA",
  AUS: "AU",
  CHN: "CN",
  JPN: "JP",
  KOR: "KR",
  IND: "IN",
  BRA: "BR",
  MEX: "MX",
  ZAF: "ZA",
  TUR: "TR",
  RUS: "RU",
  SAU: "SA",
  ARE: "AE"
};
function findCountryCode(val) {
  const normalized = normalizeCountryName(val);
  if (CUSTOM_COUNTRY_MAP[normalized]) return CUSTOM_COUNTRY_MAP[normalized];
  const match = COUNTRY_CODES.find(
    (c) => normalizeCountryName(c.name) === normalized || normalizeCountryName(c.label || "") === normalized || normalizeCountryName(c.nationality || "") === normalized
  );
  if (match) return match.code;
  const trimmed = val.trim();
  if (/^[A-Z]{3}$/i.test(trimmed)) {
    const iso3 = trimmed.toUpperCase();
    if (ISO3_TO_ISO2[iso3]) return ISO3_TO_ISO2[iso3];
  }
  if (/^[A-Z]{2}$/i.test(val.trim())) return val.trim().toUpperCase();
  return null;
}
function parseLocalizations(raw) {
  if (!raw) return [];
  const collectStrings = (input) => {
    if (Array.isArray(input)) {
      return input.flatMap((v) => collectStrings(v));
    }
    if (typeof input === "object") {
      const candidate = input.code || input.country || input.pays || input.label || input.name;
      return candidate ? collectStrings(candidate) : [];
    }
    const s = String(input || "");
    return s.split(/[,;/]/);
  };
  const items = collectStrings(raw);
  return items.map((s) => s.trim()).filter(Boolean).map((name) => ({ name, code: findCountryCode(name) }));
}

// src/two-pager/images.ts
var FLAGS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "assets",
  "flags"
);
var BRANDFETCH_ENABLED = process.env.BRANDFETCH_ENABLED === "1";
var makeSafeFilename = (val) => val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
var MAX_IMAGE_FETCH_CONCURRENCY = 4;
var IMAGE_FETCH_RETRIES = 3;
var IMAGE_FETCH_BASE_DELAY_MS = 200;
var IMAGE_FETCH_JITTER_MS = 80;
var PDF_IMAGE_MAX_DIMENSION = 1200;
var PDF_IMAGE_JPEG_QUALITY = 40;
var IMAGE_KEY_NAMES = /* @__PURE__ */ new Set([
  "image",
  "image_url",
  "imageurl",
  "logo",
  "logo_url",
  "logourl",
  "badge",
  "badgeurl",
  "badge_url",
  "icon",
  "icon_url",
  "iconurl",
  "avatar",
  "photo",
  "picture",
  "cover",
  "thumbnail",
  "thumb",
  "banner",
  "center_logo_url",
  "centerlogourl",
  "center_logo"
]);
var IMAGE_PARENT_KEYS = /* @__PURE__ */ new Set(["logo", "image", "icon", "badge", "avatar", "photo", "picture"]);
var sleep = (ms) => new Promise((resolve2) => setTimeout(resolve2, ms));
var createLimiter = (max) => {
  let active = 0;
  const queue = [];
  const acquire = () => new Promise((resolve2) => {
    if (active < max) {
      active += 1;
      resolve2();
    } else {
      queue.push(resolve2);
    }
  });
  const release = () => {
    active = Math.max(0, active - 1);
    const next = queue.shift();
    if (next) {
      active += 1;
      next();
    }
  };
  return async function(fn) {
    await acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  };
};
var normalizeMime = (value) => (value || "").split(";")[0].trim().toLowerCase();
var normalizeKey = (value) => value.replace(/\s+/g, "").toLowerCase();
var shouldInlineImageValue = (key, path2) => {
  const normalized = normalizeKey(key);
  if (IMAGE_KEY_NAMES.has(normalized)) return true;
  if ((normalized === "url" || normalized === "src") && path2.some((p) => IMAGE_PARENT_KEYS.has(normalizeKey(p)))) {
    return true;
  }
  return false;
};
var convertBufferToCompressedDataUrl = async (buf) => {
  try {
    const pipeline = sharp(buf, { limitInputPixels: 5e7 }).resize(PDF_IMAGE_MAX_DIMENSION, PDF_IMAGE_MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true
    }).flatten({ background: "#ffffff" });
    try {
      const jpeg = await pipeline.clone().jpeg({ quality: PDF_IMAGE_JPEG_QUALITY }).toBuffer();
      return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
    } catch {
      const png = await pipeline.png().toBuffer();
      return `data:image/png;base64,${png.toString("base64")}`;
    }
  } catch {
    return null;
  }
};
var buildS3SlashFallback = (url) => {
  try {
    const parsed = new URL(url);
    if (!/amazonaws\.com$/i.test(parsed.hostname)) return null;
    if (!/%2f/i.test(parsed.pathname)) return null;
    parsed.pathname = parsed.pathname.replace(/%2F/gi, "/");
    return parsed.toString();
  } catch {
    return null;
  }
};
var createPdfImageResolver = () => {
  const imageFetchLimiter = createLimiter(MAX_IMAGE_FETCH_CONCURRENCY);
  const imageCache = /* @__PURE__ */ new Map();
  const fetchImageAsDataUrl = async (url) => {
    let lastError = null;
    let lastStatus;
    let lastContentType;
    for (let attempt = 1; attempt <= IMAGE_FETCH_RETRIES; attempt += 1) {
      try {
        const res = await imageFetchLimiter(() => fetch(url));
        if (!res.ok) {
          lastStatus = res.status;
          lastError = new Error(`HTTP ${res.status}`);
        } else {
          const contentType = normalizeMime(res.headers.get("content-type"));
          lastContentType = contentType || void 0;
          const buf = Buffer.from(await res.arrayBuffer());
          if (contentType && !contentType.startsWith("image/")) {
            lastError = new Error(`Invalid content-type ${contentType}`);
          } else if (!buf.length) {
            lastError = new Error("Empty image data");
          } else {
            const converted = await convertBufferToCompressedDataUrl(buf);
            if (converted) return { dataUrl: converted };
            lastError = new Error(`Failed to decode image ${contentType || "unknown"}`);
          }
        }
      } catch (err) {
        lastError = err;
      }
      if (attempt < IMAGE_FETCH_RETRIES) {
        const backoff = IMAGE_FETCH_BASE_DELAY_MS * 2 ** (attempt - 1);
        const jitter = Math.floor(Math.random() * IMAGE_FETCH_JITTER_MS);
        await sleep(backoff + jitter);
      }
    }
    return {
      dataUrl: null,
      failure: { url, status: lastStatus, contentType: lastContentType, error: lastError }
    };
  };
  const resolveImageForPdf = (raw) => {
    if (!raw) return Promise.resolve(null);
    const key = raw.trim();
    if (!key) return Promise.resolve(null);
    const cached = imageCache.get(key);
    if (cached) return cached;
    const job = (async () => {
      if (key.startsWith("data:")) {
        try {
          const m = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(key);
          if (m) {
            const buf = m[2] ? Buffer.from(m[3], "base64") : Buffer.from(decodeURIComponent(m[3]), "utf8");
            const converted = await convertBufferToCompressedDataUrl(buf);
            if (converted) return converted;
          }
        } catch (err) {
          console.warn("PDF image inline failed", {
            raw: "[data-url]",
            failure: err instanceof Error ? err.message : String(err ?? "")
          });
        }
        return null;
      }
      let normalized = normalizeAssetUrl(key);
      try {
        const parsed = new URL(normalized);
        if (!/^https?:$/i.test(parsed.protocol)) return null;
        normalized = parsed.toString();
      } catch {
        return null;
      }
      const candidates = [normalized];
      const s3Fallback = buildS3SlashFallback(normalized);
      if (s3Fallback && s3Fallback !== normalized) candidates.push(s3Fallback);
      const failures = [];
      for (const candidate of candidates) {
        const { dataUrl, failure } = await fetchImageAsDataUrl(candidate);
        if (dataUrl) return dataUrl;
        if (failure) failures.push(failure);
      }
      if (failures.length) {
        console.warn("PDF image inline failed", {
          raw: key,
          candidates,
          failures: failures.map((failure) => ({
            url: failure.url,
            status: failure.status,
            contentType: failure.contentType,
            error: failure.error instanceof Error ? failure.error.message : String(failure.error ?? "")
          }))
        });
      }
      return null;
    })();
    imageCache.set(key, job);
    return job;
  };
  const toDataUrl = async (url) => {
    if (!url) return null;
    return resolveImageForPdf(url);
  };
  const inlineMarkdownImages = async (text) => {
    const IMG = /!\[([^\]]*)\]\(((?:https?:\/\/|data:)[^\s)]+)\)/g;
    let last = 0;
    let m;
    const out = [];
    while (m = IMG.exec(text)) {
      const idx = m.index ?? 0;
      if (idx > last) out.push(text.slice(last, idx));
      const alt = m[1] || "";
      const url = m[2] || "";
      const safe = await resolveImageForPdf(url);
      out.push(safe ? `![${alt}](${safe})` : m[0]);
      last = idx + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out.join("");
  };
  const inlineSectionImages = async (content) => {
    if (!content || typeof content !== "object") return content;
    const obj = { ...content };
    if (!Array.isArray(obj.sections)) return content;
    obj.sections = await Promise.all(
      obj.sections.map(async (sec) => {
        const nextSec = { ...sec };
        if (Array.isArray(sec.subsections)) {
          nextSec.subsections = await Promise.all(
            sec.subsections.map(async (sub) => {
              const nextSub = { ...sub };
              if (Array.isArray(sub.images)) {
                const processed = await Promise.all(
                  sub.images.map(async (im) => {
                    const rawSrc = typeof im === "string" ? im : im?.src ?? im?.url ?? im?.image ?? im?.logo ?? "";
                    const safeSrc = await resolveImageForPdf(rawSrc);
                    if (!safeSrc) return null;
                    if (typeof im === "string") return safeSrc;
                    return { ...im, src: safeSrc, url: safeSrc };
                  })
                );
                nextSub.images = processed.filter(Boolean);
              }
              if (typeof sub.text === "string") {
                nextSub.text = await inlineMarkdownImages(sub.text);
              }
              return nextSub;
            })
          );
        }
        return nextSec;
      })
    );
    return obj;
  };
  const inlineContentForPdfInternal = async (content, path2) => {
    if (typeof content === "string") return inlineMarkdownImages(content);
    if (Array.isArray(content)) {
      return Promise.all(content.map((item) => inlineContentForPdfInternal(item, path2)));
    }
    if (content && typeof content === "object") {
      let base = content;
      if (Array.isArray(content.sections)) {
        base = await inlineSectionImages(content);
      }
      const next = {};
      for (const [k, v] of Object.entries(base)) {
        if (k === "sections" && Array.isArray(base.sections)) {
          next[k] = base.sections;
          continue;
        }
        if (typeof v === "string" && shouldInlineImageValue(k, path2)) {
          next[k] = await resolveImageForPdf(v);
          continue;
        }
        next[k] = await inlineContentForPdfInternal(v, [...path2, k]);
      }
      return next;
    }
    return content;
  };
  const inlineContentForPdf = async (content) => inlineContentForPdfInternal(content, []);
  const prepareCompetitorsForPdf = async (competitors) => {
    if (!competitors?.length) return [];
    const logoLookupCache = /* @__PURE__ */ new Map();
    const flagCache = /* @__PURE__ */ new Map();
    const getCompetitorDomain = (comp) => {
      const rawUrl = comp?.URL || comp?.url || comp?.website;
      const fromUrl = getDomainFromUrl(typeof rawUrl === "string" ? rawUrl : void 0);
      if (fromUrl) return fromUrl;
      if (typeof comp?.website_domain === "string" && comp.website_domain.trim()) {
        return comp.website_domain.replace(/^https?:\/\//i, "").replace(/^www\./i, "").trim();
      }
      return null;
    };
    const fetchLogoFromWebsite = async (domain) => {
      const base = `https://${domain.replace(/^https?:\/\//i, "").replace(/\/.*$/, "")}`;
      const candidates = [
        `${base}/apple-touch-icon.png`,
        `${base}/apple-touch-icon-precomposed.png`
      ];
      try {
        const res = await imageFetchLimiter(
          () => fetch(base, { signal: AbortSignal.timeout(8e3), redirect: "follow" })
        );
        if (res.ok) {
          const html = (await res.text()).slice(0, 5e5);
          const links = [
            ...html.matchAll(
              /<link[^>]+rel=["'](?:apple-touch-icon[^"']*|icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/gi
            ),
            ...html.matchAll(
              /<link[^>]+href=["']([^"']+)["'][^>]*rel=["'](?:apple-touch-icon[^"']*|icon|shortcut icon)["']/gi
            )
          ].map((m) => m[1]);
          const og = html.match(
            /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i
          )?.[1];
          for (const href of [...links, og].filter(Boolean)) {
            try {
              candidates.push(new URL(href, res.url || base).toString());
            } catch {
            }
          }
        }
      } catch {
      }
      for (const url of candidates) {
        const dataUrl = await resolveImageForPdf(url);
        if (dataUrl) return dataUrl;
      }
      return null;
    };
    const fetchBrandLogo = (domain, name) => {
      const key = `${domain || ""}::${name || ""}`;
      const cached = logoLookupCache.get(key);
      if (cached) return cached;
      const job = (async () => {
        try {
          if (domain) {
            const siteLogo = await fetchLogoFromWebsite(domain);
            if (siteLogo) return siteLogo;
          }
          if (!BRANDFETCH_ENABLED) return null;
          if (domain) {
            const cdnLogo = await tryBrandfetchCdn(domain);
            if (cdnLogo) return cdnLogo;
            const res = await fetch(
              `https://api.brandfetch.io/v2/brands/${encodeURIComponent(domain)}?c=${BRANDFETCH_CLIENT_ID}`
            );
            if (res.ok) {
              const data = await res.json();
              const logo = pickBrandfetchLogo(data);
              if (logo) return logo;
            }
          }
          if (name) {
            const res = await fetch(
              `https://api.brandfetch.io/v2/search/${encodeURIComponent(name)}?c=${BRANDFETCH_CLIENT_ID}`
            );
            if (res.ok) {
              const data = await res.json();
              const first = Array.isArray(data) ? data[0] : null;
              const logo = pickBrandfetchLogo(first) || first?.icon || first?.logo || null;
              if (logo) return logo;
            }
          }
          return null;
        } catch {
          return null;
        }
      })();
      logoLookupCache.set(key, job);
      return job;
    };
    const resolveFlagForCode = (code) => {
      if (!code) return Promise.resolve(null);
      const key = code.toUpperCase();
      const cached = flagCache.get(key);
      if (cached) return cached;
      const job = (async () => {
        try {
          const png = readFileSync(path.join(FLAGS_DIR, `${key.toLowerCase()}.png`));
          return `data:image/png;base64,${png.toString("base64")}`;
        } catch {
          return null;
        }
      })();
      flagCache.set(key, job);
      return job;
    };
    return Promise.all(
      competitors.map(async (comp) => {
        const nameRaw = comp?.competitor_name ?? comp?.name ?? comp?.company_name ?? comp?.actor;
        const name = typeof nameRaw === "string" ? nameRaw : nameRaw != null ? String(nameRaw) : null;
        const domain = getCompetitorDomain(comp);
        const logoCandidate = typeof comp?.logo === "string" && comp.logo.trim() || typeof comp?.logo_url === "string" && comp.logo_url.trim() || typeof comp?.logoUrl === "string" && comp.logoUrl.trim() || typeof comp?.image === "string" && comp.image.trim() || typeof comp?.image_url === "string" && comp.image_url.trim() || null;
        let logoDataUrl = await resolveImageForPdf(logoCandidate);
        if (!logoDataUrl && (domain || name)) {
          const remoteLogo = await fetchBrandLogo(domain, name);
          logoDataUrl = await resolveImageForPdf(remoteLogo);
        }
        const localizationRaw = comp?.localisation ?? comp?.pays ?? comp?.country ?? comp?.pays_iso ?? comp?.pays_iso_alpha2 ?? comp?.country_iso ?? comp?.country_code ?? comp?.country_iso_alpha2 ?? comp?.country_iso2 ?? null;
        const countries = parseLocalizations(localizationRaw);
        const seen = /* @__PURE__ */ new Set();
        const uniqueCountries = countries.filter((c) => {
          const key = `${c.code || ""}|${c.name}`.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        const countryFlags = await Promise.all(
          uniqueCountries.map(async (c) => ({
            ...c,
            src: c.code ? await resolveFlagForCode(c.code) : null
          }))
        );
        return {
          ...comp,
          logoDataUrl,
          countryFlags
        };
      })
    );
  };
  return { toDataUrl, resolveImageForPdf, inlineContentForPdf, prepareCompetitorsForPdf };
};

// src/two-pager/utils/sections.ts
function toLines(val) {
  if (val === null || val === void 0) return [];
  if (Array.isArray(val)) {
    return val.flatMap((v) => v === null || v === void 0 ? [] : [v]).map((v) => sanitizeText(String(v))).filter((v) => v.trim().length > 0);
  }
  return [sanitizeText(String(val))].filter((v) => v.trim().length > 0);
}
function parseRiskOppBlock(block) {
  const items = [];
  const sourcesSet = /* @__PURE__ */ new Set();
  if (Array.isArray(block?.sources)) {
    block.sources.filter(Boolean).forEach((s) => sourcesSet.add(String(s)));
  }
  if (!block || typeof block !== "object") {
    return { items, sources: Array.from(sourcesSet) };
  }
  Object.entries(block).forEach(([key, value]) => {
    if (key.toLowerCase() === "sources") return;
    const data = value || {};
    const orderRaw = data.ordre ?? data.order ?? data.Order;
    const order = typeof orderRaw === "number" ? orderRaw : typeof orderRaw === "string" && isFinite(Number(orderRaw)) ? Number(orderRaw) : void 0;
    const score = typeof data.score === "number" ? data.score : void 0;
    const noteI = typeof data.note_I === "number" ? data.note_I : typeof data.noteI === "number" ? data.noteI : void 0;
    const noteP = typeof data.note_P === "number" ? data.note_P : typeof data.noteP === "number" ? data.noteP : void 0;
    const itemSourcesRaw = data?.sources ?? data?.source;
    const itemSources = Array.isArray(itemSourcesRaw) ? itemSourcesRaw.filter(Boolean).map((s) => String(s)) : itemSourcesRaw ? [String(itemSourcesRaw)] : [];
    itemSources.forEach((s) => sourcesSet.add(s));
    items.push({
      title: key,
      impact: toLines(data.arguments_I ?? data.argumentsI),
      probability: toLines(data.arguments_P ?? data.argumentsP),
      order,
      score,
      noteI,
      noteP,
      sources: itemSources
    });
  });
  return { items, sources: Array.from(sourcesSet) };
}
function extractRiskOpp(content, defaultType) {
  let risks = [];
  let opportunities = [];
  const sourcesSet = /* @__PURE__ */ new Set();
  const sortRiskOpp = (arr) => {
    return [...arr].sort((a, b) => {
      const ao = Number.isFinite(a.order) ? a.order : Infinity;
      const bo = Number.isFinite(b.order) ? b.order : Infinity;
      if (ao !== bo) return ao - bo;
      return a.title.localeCompare(b.title);
    });
  };
  const root = content?.RiskOpp ?? content;
  const candidates = Array.isArray(root) ? root : root && typeof root === "object" ? [root] : [];
  const addSources = (srcs) => srcs.forEach((s) => sourcesSet.add(s));
  candidates.forEach((entry) => {
    const riskBlock = entry?.Risques ?? entry?.risques;
    const oppBlock = entry?.Opportunit\u00E9s ?? entry?.Opportunites ?? entry?.opportunites;
    if (riskBlock) {
      const parsed = parseRiskOppBlock(riskBlock);
      risks = risks.concat(parsed.items);
      addSources(parsed.sources);
    }
    if (oppBlock) {
      const parsed = parseRiskOppBlock(oppBlock);
      opportunities = opportunities.concat(parsed.items);
      addSources(parsed.sources);
    }
  });
  if (defaultType === "Risques" && !risks.length) {
    const parsed = parseRiskOppBlock(root);
    risks = parsed.items;
    addSources(parsed.sources);
  }
  if (defaultType === "Opportunit\xE9s" && !opportunities.length) {
    const parsed = parseRiskOppBlock(root);
    opportunities = parsed.items;
    addSources(parsed.sources);
  }
  return {
    risks: sortRiskOpp(risks),
    opportunities: sortRiskOpp(opportunities),
    sources: Array.from(sourcesSet)
  };
}
var EQUITY_STORY_KEYS = /* @__PURE__ */ new Set([
  "equitystory",
  "equity_story",
  "equity story",
  "keyconsiderations",
  "key_considerations",
  "key considerations"
]);
function isObjectLike(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function parseJsonIfString(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (trimmed.startsWith("[") && trimmed.endsWith("]") || trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}
function parseEquityStoryIndex(value, fallbackIndex) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallbackIndex;
}
function normalizeEquityStoryItems(candidate) {
  const parsedCandidate = parseJsonIfString(candidate);
  if (Array.isArray(parsedCandidate)) {
    return parsedCandidate.map((rawItem, idx) => {
      const fallbackIndex = idx + 1;
      if (typeof rawItem === "string") {
        const title2 = sanitizeText(rawItem).trim();
        if (!title2) return null;
        return { index: fallbackIndex, title: title2, description: "" };
      }
      if (!isObjectLike(rawItem)) return null;
      const title = sanitizeText(
        String(
          rawItem.title ?? rawItem.titre ?? rawItem.name ?? rawItem.heading ?? rawItem.label ?? ""
        )
      ).trim();
      const description = sanitizeText(
        String(
          rawItem.description ?? rawItem.desc ?? rawItem.body ?? rawItem.text ?? rawItem.content ?? ""
        )
      ).trim();
      if (!title && !description) return null;
      return {
        index: parseEquityStoryIndex(rawItem.index ?? rawItem.id, fallbackIndex),
        title: title || `Point ${fallbackIndex}`,
        description
      };
    }).filter(Boolean);
  }
  if (isObjectLike(parsedCandidate)) {
    const nestedEntry = Object.entries(parsedCandidate).find(
      ([key]) => EQUITY_STORY_KEYS.has(key.toLowerCase())
    );
    if (nestedEntry) {
      return normalizeEquityStoryItems(nestedEntry[1]);
    }
    const values = Object.entries(parsedCandidate).sort(([a], [b]) => {
      const aNum = Number(a);
      const bNum = Number(b);
      if (Number.isNaN(aNum) || Number.isNaN(bNum)) return a.localeCompare(b);
      return aNum - bNum;
    }).map(([, value]) => value);
    return normalizeEquityStoryItems(values);
  }
  return [];
}
function extractEquityStory(root, content, allSections) {
  const directCandidates = [];
  if (isObjectLike(root)) {
    directCandidates.push(
      root.EquityStory,
      root.equityStory,
      root.equitystory,
      root.equity_story
    );
  }
  if (isObjectLike(content)) {
    directCandidates.push(
      content.EquityStory,
      content.equityStory,
      content.equitystory,
      content.equity_story
    );
  }
  for (const candidate of directCandidates) {
    const normalized = normalizeEquityStoryItems(candidate);
    if (normalized.length) return normalized;
  }
  if (!allSections?.length) return [];
  const equitySection = allSections.find(
    (section) => EQUITY_STORY_KEYS.has((section.title || "").toLowerCase())
  );
  if (!equitySection) return [];
  return normalizeEquityStoryItems(equitySection.content);
}
function parseDashboard(content, allSections) {
  const root = content?.Dashboard ?? content;
  const dashboardDocumentsRaw = root?.Documents ?? root?.documents;
  const dashboardDocuments = Array.isArray(dashboardDocumentsRaw) ? dashboardDocumentsRaw.map((doc2) => {
    if (!doc2) return null;
    if (typeof doc2 === "string") {
      return doc2.trim() ? doc2.trim() : null;
    }
    if (typeof doc2 === "object") {
      return Object.keys(doc2).length > 0 ? doc2 : null;
    }
    return null;
  }).filter(Boolean) : [];
  const hasDocuments = dashboardDocuments.length > 0;
  const kpisInpiRaw = root?.KPIsINPI ?? root?.kpisInpi;
  const hasKpisInpiData = Array.isArray(kpisInpiRaw) ? kpisInpiRaw.some((entry) => {
    if (!entry || typeof entry !== "object") return false;
    if (Array.isArray(entry.metrics)) {
      return entry.metrics.length > 0;
    }
    return Object.keys(entry).length > 0;
  }) : kpisInpiRaw && typeof kpisInpiRaw === "object" && Object.values(kpisInpiRaw).some((val) => {
    if (Array.isArray(val)) return val.length > 0;
    if (val && typeof val === "object") return Object.keys(val).length > 0;
    return Boolean(val);
  });
  const kpisInpi = hasKpisInpiData ? kpisInpiRaw : hasDocuments ? {} : null;
  const equityStory = extractEquityStory(root, content, allSections);
  const characteristics = {
    sector: root?.Caract\u00E9ristiques?.sector ?? root?.caracteristiques?.sector,
    subSector: root?.Caract\u00E9ristiques?.sub_sector ?? root?.caracteristiques?.sub_sector ?? root?.Caract\u00E9ristiques?.subSector,
    geographicFootprint: root?.Caract\u00E9ristiques?.geographic_footprint ?? root?.caracteristiques?.geographic_footprint,
    valueChain: Array.isArray(root?.Caract\u00E9ristiques?.value_chain_positioning) ? root.Caract\u00E9ristiques.value_chain_positioning : Array.isArray(root?.caracteristiques?.value_chain_positioning) ? root.caracteristiques.value_chain_positioning : toLines(
      root?.Caract\u00E9ristiques?.value_chain_positioning ?? root?.caracteristiques?.value_chain_positioning
    ),
    businessModel: Array.isArray(root?.Caract\u00E9ristiques?.business_model) ? root.Caract\u00E9ristiques.business_model : Array.isArray(root?.caracteristiques?.business_model) ? root.caracteristiques.business_model : toLines(root?.Caract\u00E9ristiques?.business_model ?? root?.caracteristiques?.business_model)
  };
  return {
    kpis: Array.isArray(root?.KPIs) ? root.KPIs : [],
    management: Array.isArray(root?.Management) ? root.Management : [],
    shareholding: Array.isArray(root?.Actionnariat) ? root.Actionnariat : [],
    keyEvents: Array.isArray(root?.["\xC9tapes cl\xE9s de d\xE9veloppement"]) ? root["\xC9tapes cl\xE9s de d\xE9veloppement"] : Array.isArray(root?.etapes) ? root.etapes : [],
    kpisInpi,
    documents: hasDocuments ? dashboardDocuments : [],
    characteristics,
    equityStory,
    sources: Array.isArray(root?.sources) ? root.sources.filter(Boolean).map((s) => String(s)) : Array.isArray(root?.Sources) ? root.Sources.filter(Boolean).map((s) => String(s)) : []
  };
}
function normalizeSections(payload) {
  let entries = [];
  if (Array.isArray(payload)) {
    if (payload.length === 1 && payload[0] && typeof payload[0] === "object" && Array.isArray(payload[0].merged)) {
      entries = payload[0].merged;
    } else {
      entries = payload;
    }
  } else if (payload && typeof payload === "object" && Array.isArray(payload.merged)) {
    entries = payload.merged;
  }
  const sections = [];
  entries.forEach((entry) => {
    if (entry && typeof entry === "object") {
      Object.entries(entry).forEach(([k, v]) => {
        const name = (k || "").toString().toLowerCase();
        const forbidden = ["error", "paireditem", "definition"];
        if (forbidden.includes(name)) return;
        if (v === null || v === void 0) return;
        if (typeof v === "string" && v.trim() === "") return;
        sections.push({ title: k, content: v });
      });
    }
  });
  return sections;
}

// src/two-pager/utils/exportHelpers.ts
function formatTimestamp(d = /* @__PURE__ */ new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(
    d.getMinutes()
  )}`;
}

// src/two-pager/pdf/CombinedTwoPagerPdfBuilder.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
var renderPdfToBytes = async (node) => {
  const buffer = await renderToBuffer(node);
  return new Uint8Array(buffer);
};
var buildCombinedTwoPagerPdf = async ({
  doc: doc2,
  brandLogo,
  companyLinkedinUrl,
  dashboardData,
  presentationContent,
  actionnariat,
  management,
  marketContent,
  competitors,
  insightsContent,
  notesReports,
  deals,
  articles,
  selectedSections,
  generatedAt
}) => {
  const include = (key) => !selectedSections || selectedSections.includes(key);
  const images = createPdfImageResolver();
  const createdAt = generatedAt ?? /* @__PURE__ */ new Date();
  const merged = await PDFDocument2.create();
  const parts = [];
  const baseName = makeSafeFilename(doc2.name || "two-pager") || "two-pager";
  const logoDataUrl = await images.toDataUrl(brandLogo);
  if (dashboardData && include("dashboard")) {
    const dashboardDoc = /* @__PURE__ */ jsx13(
      TwoPagerPdfDocument_default,
      {
        doc: doc2,
        data: dashboardData,
        brandLogoDataUrl: logoDataUrl,
        companyLinkedinUrl,
        generatedAt: createdAt
      }
    );
    parts.push(await renderPdfToBytes(dashboardDoc));
  }
  if (presentationContent && include("presentation")) {
    const hydratedContent = await images.inlineContentForPdf(presentationContent);
    const presentationDoc = /* @__PURE__ */ jsx13(
      TwoPagerPresentationPdfDocument_default,
      {
        doc: doc2,
        content: hydratedContent,
        brandLogoDataUrl: logoDataUrl,
        companyLinkedinUrl,
        generatedAt: createdAt
      }
    );
    parts.push(await renderPdfToBytes(presentationDoc));
  }
  if ((actionnariat?.actions?.length || actionnariat?.ops?.length || actionnariat?.advisors?.length || actionnariat?.orbisData) && include("actionnariat")) {
    const actionnariatDoc = /* @__PURE__ */ jsx13(
      ActionnariatPdfDocument_default,
      {
        doc: doc2,
        actions: actionnariat?.actions,
        ops: actionnariat?.ops,
        advisors: actionnariat?.advisors,
        orbisData: actionnariat?.orbisData,
        brandLogoDataUrl: logoDataUrl,
        generatedAt: createdAt
      }
    );
    parts.push(await renderPdfToBytes(actionnariatDoc));
  }
  if (management?.length && include("management")) {
    const managementDoc = /* @__PURE__ */ jsx13(ManagementPdfDocument_default, { doc: doc2, managers: management, generatedAt: createdAt });
    parts.push(await renderPdfToBytes(managementDoc));
  }
  if (marketContent && include("market")) {
    const hydratedMarket = await images.inlineContentForPdf(marketContent);
    const marketDoc = /* @__PURE__ */ jsx13(MarketPdfDocument_default, { doc: doc2, content: hydratedMarket, generatedAt: createdAt });
    parts.push(await renderPdfToBytes(marketDoc));
  }
  if (competitors?.length && include("competitors")) {
    const hydratedCompetitors = await images.prepareCompetitorsForPdf(competitors);
    const competitorsDoc = /* @__PURE__ */ jsx13(
      CompetitorsPdfDocument_default,
      {
        doc: doc2,
        competitors: hydratedCompetitors,
        generatedAt: createdAt
      }
    );
    parts.push(await renderPdfToBytes(competitorsDoc));
  }
  if (insightsContent && include("insights")) {
    const parsed = extractRiskOpp(insightsContent, "Risques");
    const insightsDoc = /* @__PURE__ */ jsx13(
      NaviiaInsightsPdfDocument_default,
      {
        doc: doc2,
        risks: parsed.risks,
        opportunities: parsed.opportunities,
        generatedAt: createdAt
      }
    );
    parts.push(await renderPdfToBytes(insightsDoc));
  }
  if (notesReports?.length && include("notes")) {
    const notesDoc = /* @__PURE__ */ jsx13(NotesPdfDocument_default, { doc: doc2, reports: notesReports, generatedAt: createdAt });
    parts.push(await renderPdfToBytes(notesDoc));
  }
  if (deals?.length && include("deals")) {
    const dealsDoc = /* @__PURE__ */ jsx13(DealsPdfDocument_default, { doc: doc2, deals, generatedAt: createdAt });
    parts.push(await renderPdfToBytes(dealsDoc));
  }
  if (articles?.length && include("articles")) {
    const articlesDoc = /* @__PURE__ */ jsx13(ArticlesPdfDocument_default, { doc: doc2, articles, generatedAt: createdAt });
    parts.push(await renderPdfToBytes(articlesDoc));
  }
  if (!parts.length) return null;
  for (const bytes of parts) {
    const src = await PDFDocument2.load(bytes);
    const copied = await merged.copyPages(src, src.getPageIndices());
    copied.forEach((page) => merged.addPage(page));
  }
  const finalBytes = await merged.save();
  const numberedBytes = await addPageNumbersToBytes(finalBytes);
  return {
    filename: `${baseName}_complet_${formatTimestamp(createdAt)}.pdf`,
    bytes: Buffer.from(numberedBytes)
  };
};

// src/two-pager/constants/friendlyLabels.ts
var TWO_PAGER_FRIENDLY_LABELS = {
  ExecSum: "ExecSum",
  PresentationEntreprise: "Pr\xE9sentation",
  "Pr\xE9sentationEntreprise": "Pr\xE9sentation",
  Dashboard: "Dashboard",
  "Op\xE9rations capitalistiques": "Op\xE9rations capitalistiques",
  Actionnariat: "Actionnariat",
  Management: "Management",
  Products: "Produits",
  Product: "Produits",
  products: "Produits",
  product: "Produits",
  March\u00E9: "March\xE9",
  Concurrents: "Concurrents",
  Risques: "Risques & Opportunit\xE9s",
  Opportunit\u00E9s: "Risques & Opportunit\xE9s",
  RiskOpp: "Risques & Opportunit\xE9s",
  NotesMarch\u00E9: "Notes de march\xE9",
  Brevets: "Brevets",
  BrevetsList: "Brevets",
  BrevetsImage: "Brevets",
  Reseau: "R\xE9seau",
  R\u00E9seau: "R\xE9seau",
  articles: "Articles",
  Articles: "Articles"
};

// src/two-pager/utils/tabs.ts
function getTabLabel(title, friendlyLabels) {
  if (title === "RiskOpp") return "NAVIIA Insights";
  return friendlyLabels[title] || title;
}

// src/two-pager/utils/exportData.ts
var parseWebPayload = (raw) => {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
};
var buildSectionPicker = (sections, friendlyLabels) => {
  const map = /* @__PURE__ */ new Map();
  sections.forEach((s) => {
    const label = getTabLabel(s.title, friendlyLabels);
    if (!map.has(label)) map.set(label, s);
  });
  return (...labels) => {
    for (const label of labels) {
      const match = map.get(label);
      if (match) return match;
    }
    return void 0;
  };
};
var pickExecSumLogo = (execSum) => {
  const raw = execSum?.logo?.logo_url || execSum?.logo_url || execSum?.logo?.url || execSum?.logo || null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed || null;
};
var normalizeArticles = (raw) => {
  const source = raw?.articles ?? raw;
  if (Array.isArray(source)) return source;
  if (source && typeof source === "object") {
    return Object.entries(source).sort(([a], [b]) => {
      const na = Number(a);
      const nb = Number(b);
      if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
      return na - nb;
    }).map(([, v]) => v).filter(Boolean);
  }
  return [];
};
var normalizeValorisationArray = (valorisation) => Array.isArray(valorisation?.valorisation) ? valorisation.valorisation : Array.isArray(valorisation) ? valorisation : [];
var deriveExportData = (payloadObj, friendlyLabels = TWO_PAGER_FRIENDLY_LABELS) => {
  const sections = normalizeSections(payloadObj);
  const pickSection = buildSectionPicker(sections, friendlyLabels);
  const dashboardSection = pickSection("Dashboard");
  const dashboardData = dashboardSection ? parseDashboard(dashboardSection.content, sections) : null;
  const presentationSection = pickSection("Pr\xE9sentation");
  const valorisationSection = pickSection("Valorisation", "valorisation");
  const marketSection = pickSection("March\xE9");
  const competitorsSection = pickSection("Concurrents", "Paysage concurrentiel");
  const insightsSection = pickSection("NAVIIA Insights", "RiskOpp");
  const notesSection = pickSection("Notes de march\xE9", "NotesMarch\xE9");
  const dealsSection = pickSection("Deals");
  const articlesSection = pickSection("Articles");
  const actionnariatSection = pickSection("Actionnariat");
  const managementSection = pickSection("Management");
  const orbisSection = sections.find((section) => section.title === "Orbis");
  const actionnariatContent = actionnariatSection?.content;
  const orbisData = extractOrbisData(orbisSection?.content);
  const actionnariatData = actionnariatContent || orbisData ? {
    actions: actionnariatContent?.actionnariat_actuel,
    ops: actionnariatContent?.operations_capitalistiques,
    advisors: actionnariatContent?.conseils,
    orbisData
  } : null;
  const competitorsRaw = competitorsSection?.content;
  const competitorsList = (() => {
    if (!competitorsRaw) return [];
    const comps = competitorsRaw?.competitors ?? competitorsRaw?.competiteurs ?? competitorsRaw?.competitor_list ?? competitorsRaw;
    if (Array.isArray(comps)) return comps;
    if (comps && typeof comps === "object") return Object.values(comps);
    return [];
  })();
  const insightsContent = insightsSection?.content ?? null;
  const notesReports = (() => {
    const reports = notesSection?.content?.market_reports ?? notesSection?.content;
    if (Array.isArray(reports)) return reports;
    if (reports && typeof reports === "object") return Object.values(reports);
    return [];
  })();
  const valorisationContent = (() => {
    if (!valorisationSection) return null;
    const raw = valorisationSection.content?.Valorisation ?? valorisationSection.content;
    return raw ?? null;
  })();
  const valorisationArray = normalizeValorisationArray(valorisationContent);
  const dealsList = (() => {
    const raw = dealsSection?.content;
    const root = raw?.Deals ?? raw;
    if (Array.isArray(root)) return root;
    if (root && typeof root === "object") return Object.values(root);
    return [];
  })();
  const articlesList = articlesSection ? normalizeArticles(articlesSection.content) : [];
  const execSum = sections.find((s) => s.title === "ExecSum")?.content;
  const companyLinkedinUrl = getValidLinkedinUrl(execSum?.linkedin_url);
  const execSumLogoUrl = pickExecSumLogo(execSum);
  const managementContent = managementSection?.content;
  const management = Array.isArray(managementContent?.managers) ? managementContent.managers : [];
  return {
    sections,
    dashboardData,
    presentationContent: presentationSection?.content,
    actionnariatData,
    management,
    marketContent: marketSection?.content,
    competitorsList,
    insightsContent,
    notesReports,
    dealsList,
    articlesList,
    valorisationContent,
    valorisationArray,
    companyLinkedinUrl,
    execSumLogoUrl
  };
};

// src/two-pager/index.ts
var GLYPH_REPLACEMENTS = [
  [/[≈≃∼]/g, "~"],
  [/[\u00a0\u2007\u2009\u202f]/g, " "],
  // narrow/no-break spaces
  [/≥/g, ">="],
  [/≤/g, "<="],
  [/[↗🡕]/g, "+"],
  [/[↘🡖]/g, "-"],
  [/[→⟶]/g, "->"],
  [/[✓✔]/g, "v"],
  [/[✗✘]/g, "x"]
];
function normalizeGlyphs(value) {
  if (typeof value === "string") {
    let out = value;
    for (const [pattern, replacement] of GLYPH_REPLACEMENTS) {
      out = out.replace(pattern, replacement);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map(normalizeGlyphs);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = normalizeGlyphs(v);
    }
    return next;
  }
  return value;
}
async function renderTwoPagerPdf(input) {
  const parsed = parseWebPayload(input.webPayload);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("webPayload invalide : objet JSON (ou string JSON) attendu");
  }
  const payload = normalizeGlyphs(parsed);
  const derived = deriveExportData(payload);
  const doc2 = {
    id: input.doc.id ?? "",
    name: input.doc.name,
    sector: input.doc.sector ?? [],
    country: input.doc.country ?? null,
    iso_code: input.doc.iso_code ?? null,
    website: input.doc.website ?? null,
    status: input.doc.status ?? "completed",
    created_at: input.doc.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
  };
  const sectionStats = {
    dashboard: Boolean(derived.dashboardData),
    presentation: Boolean(derived.presentationContent),
    actionnariat: Boolean(
      derived.actionnariatData?.actions?.length || derived.actionnariatData?.ops?.length || derived.actionnariatData?.advisors?.length || derived.actionnariatData?.orbisData
    ),
    management: Boolean(derived.management?.length),
    market: Boolean(derived.marketContent),
    competitors: Boolean(derived.competitorsList?.length),
    insights: Boolean(derived.insightsContent),
    notes: Boolean(derived.notesReports?.length),
    deals: Boolean(derived.dealsList?.length),
    articles: Boolean(derived.articlesList?.length)
  };
  const result = await buildCombinedTwoPagerPdf({
    doc: doc2,
    brandLogo: input.brandLogo ?? derived.execSumLogoUrl,
    companyLinkedinUrl: input.companyLinkedinUrl ?? derived.companyLinkedinUrl,
    dashboardData: derived.dashboardData,
    presentationContent: derived.presentationContent,
    actionnariat: derived.actionnariatData,
    management: derived.management,
    marketContent: derived.marketContent,
    competitors: derived.competitorsList,
    insightsContent: derived.insightsContent,
    notesReports: derived.notesReports,
    deals: derived.dealsList,
    articles: derived.articlesList,
    selectedSections: input.selectedSections,
    generatedAt: input.generatedAt
  });
  if (!result) {
    throw new Error(
      "Aucune section exploitable dans le webPayload (toutes vides ou absentes) \u2014 rien \xE0 rendre"
    );
  }
  return { filename: result.filename, bytes: result.bytes, sectionStats };
}

// src/two-pager/render-cli.ts
function fail(msg) {
  console.error(`ERREUR: ${msg}`);
  process.exit(1);
}
var args = process.argv.slice(2);
var positional = args.filter((a) => !a.startsWith("--"));
var docFlagIndex = args.indexOf("--doc");
var [payloadPath, outPath] = positional;
if (!payloadPath || !outPath) {
  fail(`usage: render.mjs <web_payload.json> <out.pdf> --doc '{"name":...}'`);
}
var doc;
try {
  doc = docFlagIndex >= 0 ? JSON.parse(args[docFlagIndex + 1]) : { name: "two-pager" };
} catch {
  fail("--doc doit \xEAtre un JSON valide");
}
if (!doc.name) fail("--doc.name est requis (nom de la soci\xE9t\xE9)");
var webPayload;
try {
  webPayload = JSON.parse(readFileSync2(resolve(payloadPath), "utf8"));
} catch (e) {
  fail(`web_payload illisible (${e instanceof Error ? e.message : e})`);
}
try {
  const result = await renderTwoPagerPdf({ doc, webPayload });
  writeFileSync(resolve(outPath), result.bytes);
  console.log(
    JSON.stringify({
      ok: true,
      out: resolve(outPath),
      filename: result.filename,
      sizeKb: Math.round(result.bytes.length / 1024),
      sections: result.sectionStats
    })
  );
} catch (e) {
  fail(e instanceof Error ? e.message : String(e));
}
