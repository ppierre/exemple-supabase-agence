-- Juste en vrac, pas testé ! J'ai fait des "exports" depuis Datagrip (JetBrains)
-- Le code actuel nécessite un utilisateur autentifié.

-- Table qui contient les données
create table "OffreMaison"
(
    id         uuid    default uuid_generate_v4() not null
        primary key,
    nom        varchar,
    prix       real,
    favori     boolean default false              not null,
    image      varchar,
    "nbrLits"  smallint,
    "nbrSDB"   smallint,
    adresse    json,
    surface    varchar,
    image_id   uuid
        references storage.objects,
    image_name text
);

-- Bucket de stockage de fichiers à faire :
-- le public (dont le code est en commentaire)
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public) VALUES ('images-maisons', 'images-maisons', null, '2022-06-24 16:36:39.495200 +00:00', '2022-06-24 16:36:39.495200 +00:00', true);
-- le privé qui utilise actuelement des URL "privé" avec JWT
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public) VALUES ('prive-images-maisons', 'prive-images-maisons', null, '2022-06-27 18:48:21.306710 +00:00', '2022-06-27 18:48:21.306710 +00:00', false);
