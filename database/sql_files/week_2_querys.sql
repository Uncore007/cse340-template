-- First assignment
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- Second assignment
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Third assignment
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Fourth assignment
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Fifth assignment
SELECT inv.inv_make, inv.inv_model
FROM public.inventory inv
LEFT JOIN public.classification cls 
    ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- Sixth assignment
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');