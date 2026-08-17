import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


const uploadFile = async (file, folder) => {
  if (!file) throw new Error("Archivo no recibido");

  const fileName = `${Date.now()}_${file.originalname}`;
  const path = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(process.env.STORAGE_BUCKET)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  return data; 
};

export { supabase };

export default {
  uploadFile,
};
