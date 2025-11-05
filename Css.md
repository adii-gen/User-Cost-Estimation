## 5 way to use CSS in best way

 SELECT vp.*
FROM vendor_profiles vp
WHERE vp.vendor_id = 'ba8c068c-4adb-42f6-bf6b-bd09df4f4991'

## product for vendor (getVendorProducts)
SELECT vpr.*
FROM vendor_products vpr
WHERE vpr.vendor_id = 'ba8c068c-4adb-42f6-bf6b-bd09df4f4991'

## Service for vendor (getVendorServices)
SELECT vs.*
FROM vendor_services vs
WHERE vs.vendor_id = 'a7055a6c-d5e3-4d40-986b-449a2111fb8d'