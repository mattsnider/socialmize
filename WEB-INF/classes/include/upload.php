<?php
// +------------------------------------------------------------------------+
// | class.upload.php                                                       |
// +------------------------------------------------------------------------+
// | Copyright (c) Colin Verot 2003-2006. All rights reserved.              |
// | Version       0.18                                                     |
// | Last modified 02/02/2006                                               |
// | Email         colin@verot.net                                          |
// | Web           http://www.verot.net                                     |
// +------------------------------------------------------------------------+
// | This program is free software; you can redistribute it and/or modify   |
// | it under the terms of the GNU General Public License version 2 as      |
// | published by the Free Software Foundation.                             |
// |                                                                        |
// | This program is distributed in the hope that it will be useful,        |
// | but WITHOUT ANY WARRANTY; without even the implied warranty of         |
// | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the          |
// | GNU General Public License for more details.                           |
// |                                                                        |
// | You should have received a copy of the GNU General Public License      |
// | along with this program; if not, write to the                          |
// |   Free Software Foundation, Inc., 59 Temple Place, Suite 330,          |
// |   Boston, MA 02111-1307 USA                                            |
// |                                                                        |
// | Please give credit on sites that use class.upload and submit changes   |
// | of the script so other people can use them as well.                    |
// | This script is free to use, don't abuse.                               |
// +------------------------------------------------------------------------+
//

/**
 * Class upload
 *
 * @version   0.18
 * @author    Colin Verot <colin@verot.net>
 * @license   http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Colin Verot
 * @package   cmf
 * @subpackage external
 */

/**
 * Class upload
 *
 * <b>What does it do?</b>
 *
 * It manages file uploads for you. In short, it manages the uploaded file, and
 * allows you to do whatever you want with the file, especially if it is an image,
 * as many times as you want.
 *
 * It is the ideal class to quickly integrate file upload in your site.
 * If the file is an image, you can convert and resize it in many ways.
 * That's all you need for a gallery script for instance.
 *
 * <b>How does it work?</b>
 *
 * You instanciate the class with the $_FILES['my_field'] array
 * where my_field is the field name from your upload form.
 * The class will check if the original file has been uploaded
 * to its temporary location.
 *
 * You can then set a number of processing variables to act on the file.
 * For instance, you can rename the file, and if it is an image,
 * convert and resize it in many ways.
 * You can also set what will the class do if the file already exists.
 *
 * Then you call the function {@link process} to actually perform the actions
 * according to the processing parameters you set above.
 * It will create new instances of the original file,
 * so the original file remains the same between each process.
 * The file will be manipulated, and copied to the given location.
 * The processing variables will be reseted once it is done.
 *
 * You can repeat setting up a new set of processing variables,
 * and calling {@link process} again as many times as you want.
 * When you have finished, you can call {@link clean} to delete
 * the original uploaded file.
 *
 * If you don't set any processing parameters and call {@link process}
 * just after instanciating the class. The uploaded file will be simply
 * copied to the given location without any alteration or checks.
 *
 * Don't forget to add <i>enctype="multipart/form-data"</i> in your form
 * tag <form> if you want your form to upload the file.
 *
 * <b>How to use it?</b><br>
 * Create a simple HTML file, with a form such as:
 * <pre>
 * <form enctype="multipart/form-data" method="post" action="upload.php">
 *   <input type="file" size="32" name="image_field" value="">
 *   <input type="submit" name="Submit" value="upload">
 * </form>
 * </pre>
 * Create a file called upload.php:
 * <pre>
 * <?php
 *  $MyObject = new upload($_FILES['image_field']);
 *  if ($MyObject->uploaded) {
 *      $MyObject->file_new_name_body   = 'image_resized';
 *      $MyObject->image_resize         = true;
 *      $MyObject->image_x              = 100;
 *      $MyObject->image_ratio_y        = true;
 *      $MyObject->process('/home/user/files/');
 *      if ($MyObject->processed) {
 *          echo 'image resized';
 *          $MyObject->clean();
 *      } else {
 *          echo 'error : ' . $MyObject->error;
 *      }
 *  }
 * ?>
 * </pre>
 *
 * <b>Processing parameters</b> (reseted after each process)
 * <ul>
 *  <li><b>file_new_name_body</b> replaces the name body (default: '')<br>
 *  <pre>$MyObject->file_new_name_body = 'new name';</pre></li>
 *  <li><b>file_name_body_add</b> appends to the name body (default: '')<br>
 *  <pre>$MyObject->file_name_body_add = '_uploaded';</pre></li>
 *  <li><b>file_new_name_ext</b> replaces the file extension (default: '')<br>
 *  <pre>$MyObject->file_new_name_ext = 'txt';</pre></li>
 *  <li><b>file_safe_name</b> formats the filename (spaces changed to _) (default: true)<br>
 *  <pre>$MyObject->file_safe_name = true;</pre></li>
 *  <li><b>file_overwrite</b> sets behaviour if file already exists (default: false)<br>
 *  <pre>$MyObject->file_overwrite = true;</pre></li>
 *  <li><b>file_auto_rename</b> automatically renames file if it already exists (default: true)<br>
 *  <pre>$MyObject->file_auto_rename = true;</pre></li>
 *  <li><b>file_max_size</b> sets maximum upload size (default: upload_max_filesize from php.ini)<br>
 *  <pre>$MyObject->file_max_size = '1024'; // 1KB</pre></li>
 *  <li><b>mime_magic_check</b> sets if the class uses mime_magic (default: false)<br>
 *  <pre>$MyObject->mime_magic_check = true;</pre></li>
 *  <li><b>no_script</b> sets if the class turns scripts into test files (default: true)<br>
 *  <pre>$MyObject->no_script = false;</pre></li>
 *  <li><b>allowed</b> array of allowed mime-types (default: check {@link Init})<br>
 *  <pre>$MyObject->allowed = array('application/pdf','application/msword');</pre></li>
 *  <li><b>image_convert</b> if set, image will be converted (possible values : ''|'png'|'jpeg'|'gif'; default: '')<br>
 *  <pre>$MyObject->image_convert = 'jpg';</pre></li>
 *  <li><b>jpeg_quality</b> sets the compression quality for JPEG images (default: 75)<br>
 *  <pre>$MyObject->jpeg_quality = 50;</pre></li>
 *  <li><b>image_resize</b> determines is an image will be resized (default: false)<br>
 *  <pre>$MyObject->image_resize = true;</pre></li>
 * </ul>
 *  The following variables are used only if {@link image_resize} == true
 * <ul>
 *  <li><b>image_x</b> destination image width (default: 150)<br>
 *  <pre>$MyObject->image_x = 100;</pre></li>
 *  <li><b>image_y</b> destination image height (default: 150)<br>
 *  <pre>$MyObject->image_y = 200;</pre></li>
 * </ul>
 *  Use either one of the following
 * <ul>
 *  <li><b>image_ratio</b> if true, resize image conserving the original sizes ratio, using {@link image_x} AND {@link image_y} as max sizes if true (default: false)<br>
 *  <pre>$MyObject->image_ratio = true;</pre></li>
 *  <li><b>image_ratio_no_zoom_in</b> same as {@link image_ratio}, but won't resize if the source image is smaller than {@link image_x} x {@link image_y} (default: false)<br>
 *  <pre>$MyObject->image_ratio_no_zoom_in = true;</pre></li>
 *  <li><b>image_ratio_no_zoom_out</b> same as {@link image_ratio}, but won't resize if the source image is bigger than {@link image_x} x {@link image_y} (default: false)<br>
 *  <pre>$MyObject->image_ratio_no_zoom_in = true;</pre></li>
 *  <li><b>image_ratio_x</b> if true, resize image, calculating {@link image_x} from {@link image_y} and conserving the original sizes ratio (default: false)<br>
 *  <pre>$MyObject->image_ratio_x = true;</pre></li>
 *  <li><b>image_ratio_y</b> if true, resize image, calculating {@link image_y} from {@link image_x} and conserving the original sizes ratio (default: false)<br>
 *  <pre>$MyObject->image_ratio_y = true;</pre></li>
 * </ul>
 *
 * <b>Requirements</b>
 *
 * <b>Changelog</b>
 * <ul>
 *  <li><b>v 0.18</b> 02/02/2006<br>
 *   - added {@link no_script} to turn dangerous scripts into text files.<br>
 *   - added {@link mime_magic_check} to set the class to use mime_magic.<br>
 *   - added {@link preserve_transparency} *experimental*. Thanks Gregor.<br>
 *   - fixed size and mime checking, wasn't working :/ Thanks Willem.<br>
 *   - fixed memory leak when resizing images.<br>
 *   - when resizing, it is not necessary anymore to set {@link image_convert}.<br>
 *   - il is now possible to simply convert an image, with no resizing.<br>
 *   - sets the default {@link file_max_size} to upload_max_filesize from php.ini. Thanks Edward</li>
 *  <li><b>v 0.17</b> 28/05/2005<br>
 *   - the class can be used with any version of GD.<br>
 *   - added security check on the file with a list of mime-types.<br>
 *   - changed the license to GPL v2 only</li>
 *  <li><b>v 0.16</b> 19/05/2005<br>
 *   - added {@link file_auto_rename} automatic file renaming if the same filename already exists.<br>
 *   - added {@link file_safe_name} safe formatting of the filename (spaces to _underscores so far).<br>
 *   - added some more error reporting to avoid crash if GD is not present</li>
 *  <li><b>v 0.15</b> 16/04/2005<br>
 *   - added JPEG compression quality setting. Thanks Vad</li>
 *  <li><b>v 0.14</b> 14/03/2005<br>
 *   - reworked the class file to allow parsing with phpDocumentor</li>
 *  <li><b>v 0.13</b> 07/03/2005<br>
 *   - fixed a bug with {@link image_ratio}. Thanks Justin.<br>
 *   - added {@link image_ratio_no_zoom_in} and {@link image_ratio_no_zoom_out}</li>
 *  <li><b>v 0.12</b> 21/01/2005<br>
 *   - added {@link image_ratio} to resize within max values, keeping image ratio</li>
 *  <li><b>v 0.11</b> 22/08/2003<br>
 *   - update for GD2 (changed imageresized() into imagecopyresampled() and imagecreate() into imagecreatetruecolor())</li>
 * </ul>
 *
 * @package   cmf
 * @subpackage external
 */
class upload {

    
    /**
     * Uploaded file name
     *
     * @access public
     * @var string
     */
    var $file_src_name;

    /**
     * Uploaded file name body (i.e. without extension)
     *
     * @access public
     * @var string
     */
    var $file_src_name_body;

    /**
     * Uploaded file name extension
     *
     * @access public
     * @var string
     */
    var $file_src_name_ext;

    /**
     * Uploaded file MIME type
     *
     * @access public
     * @var string
     */
    var $file_src_mime;

    /**
     * Uploaded file size, in bytes
     *
     * @access public
     * @var double
     */
    var $file_src_size;

    /**
     * Holds eventual PHP error code from $_FILES
     *
     * @access public
     * @var string
     */
    var $file_src_error;

    /**
     * Uloaded file name, including server path
     *
     * @access private
     * @var string
     */
    var $file_src_pathname;

    /**
     * Destination file name
     *
     * @access private
     * @var string
     */
    var $file_dst_path;

    /**
     * Destination file name
     *
     * @access public
     * @var string
     */
    var $file_dst_name;

    /**
     * Destination file name body (i.e. without extension)
     *
     * @access public
     * @var string
     */
    var $file_dst_name_body;

    /**
     * Destination file extension
     *
     * @access public
     * @var string
     */
    var $file_dst_name_ext;

    /**
     * Destination file name, including path
     *
     * @access private
     * @var string
     */
    var $file_dst_pathname;

    /**
     * Source image width
     *
     * @access private
     * @var integer
     */
    var $image_src_x;

    /**
     * Source image height
     *
     * @access private
     * @var integer
     */
    var $image_src_y;

    /**
     * Destination image width
     *
     * @access private
     * @var integer
     */
    var $image_dst_x;

    /**
     * Destination image height
     *
     * @access private
     * @var integer
     */
    var $image_dst_y;

    /**
     * Flag set after instanciating the class
     *
     * Indicates if the file has been uploaded properly
     *
     * @access public
     * @var bool
     */
    var $uploaded;

    /**
     * Flag set after calling a process
     *
     * Indicates if the processing, and copy of the resulting file went OK
     *
     * @access public
     * @var bool
     */
    var $processed;

    /**
     * Holds eventual error message in plain english
     *
     * @access public
     * @var string
     */
    var $error;

    /**
     * Holds an HTML formatted log
     *
     * @access public
     * @var string
     */
    var $log;

    // overiddable processing variables
    
    
    /**
     * Set this variable to replace the name body (i.e. without extension)
     *
     * @access public
     * @var string
     */
    var $file_new_name_body;

    /**
     * Set this variable to add a string to the faile name body
     *
     * @access public
     * @var string
     */
    var $file_name_body_add;

    /**
     * Set this variable to change the file extension
     *
     * @access public
     * @var string
     */
    var $file_new_name_ext;

    /**
     * Set this variable to format the filename (spaces changed to _)
     *
     * @access public
     * @var boolean
     */
    var $file_safe_name;

    /**
     * Set this variable to true if you want to check the MIME type against a mime_magic file
     *
     * This variable is set to false by default as many systems don't have mime_magic installed or properly set
     *
     * @access public
     * @var boolean
     */
    var $mime_magic_check;

    /**
     * Set this variable to false if you don't want to turn dangerous scripts into simple text files
     *
     * @access public
     * @var boolean
     */
    var $no_script;

    /**
     * Set this variable tu true to allow automatic renaming of the file
     * if the file already exists
     *
     * Default value is true
     *
     * For instance, on uploading foo.ext,<br>
     * if foo.ext already exists, upload will be renamed foo_1.ext<br>
     * and if foo_1.ext already exists, upload will be renamed foo_2.ext<br>
     *
     * @access public
     * @var bool
     */
    var $file_auto_rename;

    /**
     * Set this variable tu true to allow overwriting of an existing file
     *
     * Default value is false, so no files will be overwritten
     *
     * @access public
     * @var bool
     */
    var $file_overwrite;

    /**
     * Set this variable to change the maximum size in bytes for an uploaded file
     *
     * Default value is the value <i>upload_max_filesize</i> from php.ini
     *
     * @access public
     * @var double
     */
    var $file_max_size;

    /**
     * Set this variable to true to resize the file if it is an image
     *
     * You will probably want to set {@link image_x} and {@link image_y}, and maybe one of the ratio variables
     *
     * Default value is false (no resizing)
     *
     * @access public
     * @var bool
     */
    var $image_resize;

    /**
     * Set this variable to convert the file if it is an image
     *
     * Possibles values are : ''; 'png'; 'j  g'; 'gif'
     *
     * Default value is '' (no conversion)<br>
     * If {@link resize} is true, {@link convert} will be set to the source file extension 
     *
     * @access public
     * @var string
     */
    var $image_convert;

    /**
     * Set this variable to the wanted (or maximum/minimum) width for the processed image, in pixels
     *
     * Default value is 150
     *
     * @access public
     * @var integer
     */
    var $image_x;

    /**
     * Set this variable to the wanted (or maximum/minimum) height for the processed image, in pixels
     *
     * Default value is 150
     *
     * @access public
     * @var integer
     */
    var $image_y;

    /**
     * Set this variable to keep the original size ratio to fit within {@link image_x} x {@link image_y}
     *
     * Default value is false
     *
     * @access public
     * @var bool
     */
    var $image_ratio;

    /**
     * Set this variable to keep the original size ratio to fit within {@link image_x} x {@link image_y}, but only if original image is bigger
     *
     * Default value is false
     *
     * @access public
     * @var bool
     */
    var $image_ratio_no_zoom_in;

    /**
     * Set this variable to keep the original size ratio to fit within {@link image_x} x {@link image_y}, but only if original image is smaller
     *
     * Default value is false
     *
     * @access public
     * @var bool
     */
    var $image_ratio_no_zoom_out;

    /**
     * Set this variable to calculate {@link image_x} automatically , using {@link image_y} and conserving ratio
     *
     * Default value is false
     *
     * @access public
     * @var bool
     */
    var $image_ratio_x;

    /**
     * Set this variable to calculate {@link image_y} automatically , using {@link image_x} and conserving ratio
     *
     * Default value is false
     *
     * @access public
     * @var bool
     */
    var $image_ratio_y;

    /**
     * Quality of JPEG created/converted destination image
     *
     * Default value is 75
     *
     * @access public
     * @var integer;
     */
    var $jpeg_quality;
    
    
    /**
     * Preserve transparency when resizing or converting an image (experimental)
     *
     * Default value is false
     *
     * Currently works only when resizing GIFs or converting transparent GIF to PNG<br>
     * It has problems with transparent PNG
     *
     * @access public
     * @var integer;
     */
    var $preserve_transparency;
    
    
    /**
     * Allowed MIME types
     *
     * Default is a selection of safe mime-types, but you might want to change it
     *
     * @access public
     * @var integer;
     */
    var $allowed;
    

    /**
     * Init or re-init all the processing variables to their default values
     *
     * This function is called in the constructor, and after each call of {@link process}
     *
     * @access private
     */
    function init() {

        // overiddable variables
        $this->file_new_name_body      = '';       // replace the name body
        $this->file_name_body_add      = '';       // append to the name body
        $this->file_new_name_ext       = '';       // replace the file extension
        $this->file_safe_name          = true;     // format safely the filename
        $this->file_overwrite          = false;    // allows overwritting if the file already exists
        $this->file_auto_rename        = true;     // auto-rename if the file already exists

        $this->mime_magic_check        = false;    // don't double check the MIME type with mime_magic
        $this->no_script               = true;     // turns scripts into test files

        $this->file_max_size = preg_replace('/M/', '000000', ini_get('upload_max_filesize'));

        $this->image_resize            = false;    // resize the image
        $this->image_convert           = '';       // convert. values :''; 'png'; 'jpeg'; 'gif'

        $this->image_x                 = 150;
        $this->image_y                 = 150;
        $this->image_ratio             = false;
        $this->image_ratio_no_zoom_in  = false;
        $this->image_ratio_no_zoom_out = false;
        $this->image_ratio_x           = false;    // calculate the $image_x if true
        $this->image_ratio_y           = false;    // calculate the $image_y if true
        $this->jpeg_quality            = 75;
        $this->preserve_transparency   = false;
        
        $this->allowed = array("application/arj",
                               "application/excel",
                               "application/gnutar",
                               "application/msword",
                               "application/mspowerpoint",
                               "application/octet-stream",
                               "application/pdf",
                               "application/powerpoint",
                               "application/postscript",
                               "application/plain",
                               "application/rtf",
                               "application/vnd.ms-excel",
                               "application/vocaltec-media-file",
                               "application/wordperfect",
                               "application/x-bzip",
                               "application/x-bzip2",
                               "application/x-compressed",
                               "application/x-excel",
                               "application/x-gzip",
                               "application/x-latex",
                               "application/x-midi",
                               "application/x-msexcel",
                               "application/x-rtf",
                               "application/x-sit",
                               "application/x-stuffit",
                               "application/x-shockwave-flash",
                               "application/x-troff-msvideo",
                               "application/x-zip-compressed",
                               "application/xml",
                               "application/zip",
                               "audio/aiff",
                               "audio/basic",
                               "audio/midi",
                               "audio/mod",
                               "audio/mpeg",
                               "audio/mpeg3",
                               "audio/wav",
                               "audio/x-aiff",
                               "audio/x-au",
                               "audio/x-mid",
                               "audio/x-midi",
                               "audio/x-mod",
                               "audio/x-mpeg-3",
                               "audio/x-wav",
                               "audio/xm",
                               "image/bmp",
                               "image/gif",
                               "image/jpeg",
                               "image/pjpeg",
                               "image/png",
                               "image/tiff",
                               "image/x-icon",
                               "image/x-tiff",
                               "image/x-windows-bmp",
                               "multipart/x-zip",
                               "multipart/x-gzip",
                               "music/crescendo",
                               "text/richtext",
                               "text/plain",
                               "text/xml",
                               "video/avi",
                               "video/mpeg",
                               "video/msvideo",
                               "video/quicktime",
                               "video/quicktime",
                               "video/x-mpeg",
                               "video/x-ms-asf",
                               "video/x-ms-asf-plugin",
                               "video/x-msvideo",
                               "x-music/x-midi");
    }

    /**
     * Constructor. Checks if the file has been uploaded
     *
     * The constructor takes $_FILES['form_field'] array as argument
     * where form_field is the form field name
     *
     * The constructor will check if the file has been uploaded in its temporary location, and
     * accordingly will set {@link uploaded} (and {@link error} is an error occurred)
     *
     * If the file has been uploaded, the constructor will populate all the variables holding the upload information (none of the processing class variables are used here).
     * You can have access to information about the file (name, size, MIME type...).
     *
     * @access private
     * @param  array $file $_FILES['form_field']
     */
    function upload($file) {

        $this->file_src_name      = '';
        $this->file_src_name_body = '';
        $this->file_src_name_ext  = '';
        $this->file_src_mime      = '';
        $this->file_src_size      = '';
        $this->file_src_error     = '';
        $this->file_src_pathname  = '';

        $this->file_dst_path      = '';
        $this->file_dst_name      = '';
        $this->file_dst_name_body = '';
        $this->file_dst_name_ext  = '';
        $this->file_dst_pathname  = '';

        $this->image_src_x        = 0;
        $this->image_src_y        = 0;
        $this->image_dst_type     = '';
        $this->image_dst_x        = 0;
        $this->image_dst_y        = 0;

        $this->uploaded           = true;
        $this->processed          = true;
        $this->error              = '';
        $this->log                = '';        
        $this->allowed            = array();
        $this->init();

        if (!$file) {
            $this->uploaded = false;
            $this->error = 'File upload error. Please try again.';
        }

        if ($this->uploaded) {
            $this->file_src_error         = $file['error'];
            switch($this->file_src_error) {
                case 0:
                    // all is OK
                    $this->log .= '- upload OK<br />';
                    break;
                case 1:
                    $this->uploaded = false;
                    $this->error = 'File upload error (the uploaded file exceeds the upload_max_filesize directive in php.ini).';
                    break;
                case 2:
                    $this->uploaded = false;
                    $this->error = 'File upload error (the uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the html form).';
                    break;
                case 3:
                    $this->uploaded = false;
                    $this->error = 'File upload error (the uploaded file was only partially uploaded).';
                    break;
                case 4:
                    $this->uploaded = false;
                    $this->error = 'File upload error (no file was uploaded).';
                    break;
                default:
                    $this->uploaded = false;
                    $this->error = 'File upload error (unknown error code).';
            }
        }

        if ($this->uploaded) {
            $this->file_src_pathname   = $file['tmp_name'];
            $this->file_src_name       = $file['name'];
            if ($this->file_src_name == '') {
                $this->uploaded = false;
                $this->error = 'File upload error. Please try again.';
            }
        }

        if ($this->uploaded) {
            $this->log .= '- file name OK<br />';
            ereg('\.([^\.]*$)', $this->file_src_name, $extension);
            $this->file_src_name_ext      = strtolower($extension[1]);
            $this->file_src_name_body     = substr($this->file_src_name, 0, ((strlen($this->file_src_name) - strlen($this->file_src_name_ext)))-1);
            $this->file_src_size        = $file['size'];
            $this->file_src_mime = $file['type'];
        }

        $this->log .= '- source variables<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_name         : ' . $this->file_src_name . '<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_name_body    : ' . $this->file_src_name_body . '<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_name_ext     : ' . $this->file_src_name_ext . '<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_pathname     : ' . $this->file_src_pathname . '<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_mime         : ' . $this->file_src_mime . '<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_size         : ' . $this->file_src_size . ' (max= ' . $this->file_max_size . ')<br />';
        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_src_error        : ' . $this->file_src_error . '<br />';

    }


    /**
     * Returns the version of GD
     *
     * This function is copyright Justin Greer, and has been found on php.net
     *
     * @access public
     */
    function gd_version() {
        static $gd_version_number = null;
        if ($gd_version_number === null) {
            ob_start();
            phpinfo(8);
            $module_info = ob_get_contents();
            ob_end_clean();
            if (preg_match("/\bgd\s+version\b[^\d\n\r]+?([\d\.]+)/i",
                   $module_info,$matches)) {
                $gd_version_number = $matches[1];
            } else {
                $gd_version_number = 0;
            }
        }
        return $gd_version_number;
    } 
    

    /**
     * Actually uploads the file, and act on it according to the set processing class variables
     *
     * This function copies the uploaded file to the given location, eventually performing actions on it.
     * Typically, you can call {@link process} several times for the same file,
     * for instance to create a resized image and a thumbnail of the same file.
     * The original uploaded file remains intact in its temporary location, so you can use {@link process} several times.
     * You will be able to delete the uploaded file with {@link clean} when you have finished all your {@link process} calls.
     *
     * According to the processing class variables set in the calling file, the file can be renamed,
     * and if it is an image, can be resized or converted.
     *
     * When the processing is completed, and the file copied to its new location, the
     * processing class variables will be reset to their default value.
     * This allows you to set new properties, and perform another {@link process} on the same uploaded file
     *
     * It will set {@link processed} (and {@link error} is an error occurred)
     *
     * @access public
     * @param  string $server_path Path location of the uploaded file, with an ending slash
     */
    function process($server_path) {
        $this->error        = '';
        $this->processed    = true;
				
        // checks file size and mine type
        if ($this->uploaded) {

            if ($this->file_src_size > $this->file_max_size ) {
                $this->processed = false;
                $this->error = 'File too big.';
            } else {
                $this->log .= '- file size OK<br />';
            }

           // turn dangerous scripts into text files
            if ($this->no_script) {
                if (((substr($this->file_src_mime, 0, 5) == 'text/' || strpos($this->file_src_mime, 'javascript'))  && (substr($this->file_src_name, -4) != '.txt')) 
                    || preg_match('/\.(php|pl|py|cgi|asp)$/i', $this->file_src_name)) {
                    $this->file_src_mime = 'text/plain';
                    $this->log .= '- script ' . $this->file_src_name . ' renamed as ' . $this->file_src_name . '.txt!<br />';
                    $this->file_src_name_ext .= '.txt';
                } 
            }

            // checks MIME type with mime_magic
            if ($this->mime_magic_check && function_exists('mime_content_type')) {
                $detected_mime = mime_content_type($this->file_src_pathname);
                if ($this->file_src_mime != $detected_mime) {
                    $this->log .= '- MIME type detected as ' . $detected_mime . ' but given as ' . $this->file_src_mime . '!<br />';
                    $this->file_src_mime = $detected_mime;
                }
            }
 
            if (!array_key_exists($this->file_src_mime, array_flip($this->allowed))) {
                $this->processed = false;
                $this->error = 'Incorrect type of file.';
            } else {
                $this->log .= '- file mime ' . $this->file_src_mime . ' OK<br />';
            }
        } else {
            $this->error = 'File not uploaded. Can\'t carry on a process<br />';
            $this->processed = false;
        }

        if ($this->processed) {
            $this->file_dst_path        = $server_path;

            // repopulate dst variables from src
            $this->file_dst_name        = $this->file_src_name;
            $this->file_dst_name_body   = $this->file_src_name_body;
            $this->file_dst_name_ext    = $this->file_src_name_ext;


            if ($this->file_new_name_body != '') { // rename file body
                $this->file_dst_name_body = $this->file_new_name_body;
                $this->log .= '- new file name body : ' . $this->file_new_name_body  . '<br />';
            }
            if ($this->file_new_name_ext != '') { // rename file ext
                $this->file_dst_name_ext  = $this->file_new_name_ext;
                $this->log .= '- new file name ext : ' . $this->file_new_name_ext . '<br />';
            }
               if ($this->file_name_body_add != '') { // append a bit to the name
                $this->file_dst_name_body  = $this->file_dst_name_body . $this->file_name_body_add;
                $this->log .= '- file name body add : ' . $this->file_name_body_add . '<br />';
            }
            if ($this->file_safe_name) { // formats the name
                $this->file_dst_name_body = str_replace(' ', '_', $this->file_dst_name_body) ;
                $this->log .= '- file name safe format<br />';
            }

            $this->log .= '- destination variables<br />';
            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_dst_path         : ' . $this->file_dst_path . '<br />';
            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_dst_name_body    : ' . $this->file_dst_name_body . '<br />';
            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_dst_name_ext     : ' . $this->file_dst_name_ext . '<br />';

            if ($this->image_resize || $this->image_convert != '') {
                if ($this->image_convert=='') {
                    $this->file_dst_name = $this->file_dst_name_body . '.' . $this->file_dst_name_ext;
                    $this->log .= '- image operation, keep extension<br />';
                } else {
                    $this->file_dst_name = $this->file_dst_name_body . '.' . $this->image_convert;
                    $this->log .= '- image operation, change extension for conversion type<br />';
                }
            } else {
                $this->file_dst_name = $this->file_dst_name_body . '.' . $this->file_dst_name_ext;
                $this->log .= '- no image operation, keep extension<br />';
            }
            
            if (!$this->file_auto_rename) {
                $this->log .= '- no auto_rename if same filename exists<br />';
                $this->file_dst_pathname = $this->file_dst_path . $this->file_dst_name;
            } else {
                $this->log .= '- checking for auto_rename<br />';
                $this->file_dst_pathname = $this->file_dst_path . $this->file_dst_name;
                $body     = $this->file_dst_name_body;
                $cpt = 1;
                while (@file_exists($this->file_dst_pathname)) {
                    $this->file_dst_name_body = $body . '_' . $cpt;
                    $this->file_dst_name = $this->file_dst_name_body . '.' . $this->file_dst_name_ext;
                    $cpt++;
                    $this->file_dst_pathna_d = $this->file_dst_path . $this->file_dst_name;
                    $this->log .= '- auto_rename to ' . $this->file_dst_name . '<br />';
                }               
            }
            
            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_dst_name         : ' . $this->file_dst_name . '<br />';
            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;file_dst_pathname     : ' . $this->file_dst_pathname . '<br />';

            if ($this->file_overwrite) {
                 $this->log .= '- no overwrite checking<br />';
            } else {
                if (@file_exists($this->file_dst_pathname)) {
                    $this->processed = false;
                    $this->error = $this->file_dst_name . ' already exists. Please change the file name.<br />';
                } else {
                    $this->log .= '- ' . $this->file_dst_name . ' doesn\'t exist already<br />';
                }
            }
        } else {
                $this->processed = false;
        }

        if (!is_uploaded_file($this->file_src_pathname)) {
            $this->processed = false;
            $this->error = 'No correct source file. Can\'t carry on a process<br />';
        }

        if (!file_exists($this->file_src_pathname)) {
            $this->processed = false;
            $this->error = 'No source file. Can\'t carry on a process<br />';
        }
				
        if ($this->processed) {
            if ($this->image_resize || $this->image_convert != '') {
                $this->log .= '- image resizing or conversion wanted<br />';
                switch($this->file_src_mime) {
                    case 'image/pjpeg':
                    case 'image/jpeg':
                    case 'image/jpg':
                        if( !function_exists('imagecreatefromjpeg')) {
                            $this->processed = false;
                            $this->error = 'No create from JPEG support';
                        } else {
                            $image_src = @imagecreatefromjpeg($this->file_src_pathname);
                            if (!$image_src) {
                                $this->processed = false;
                                $this->error = 'No JPEG read support';
                            } else {
                                $this->log .= '- source image is JPEG<br />';
                            }
                        }
                        break;
                    case 'image/png':
                        if (!function_exists('imagecreatefrompng')) {
                            $this->processed = false;
                            $this->error = 'No create from PNG support';
                        } else {
                            $image_src = @imagecreatefrompng($this->file_src_pathname);
                            if (!$image_src) {
                                $this->processed = false;
                                $this->error = 'No PNG read support';
                            } else {
                                $this->log .= '- source image is PNG<br />';
                            }
                        }
                        break;
                    case 'image/gif':
                        if (!function_exists('imagecreatefromgif')) {
                            $this->processed = false;
                            $this->error = 'No create from GIF support';
                        } else {
                            $image_src = @imagecreatefromgif($this->file_src_pathname);
                            if (!$image_src) {
                                $this->processed = false;
                                $this->error = 'No GIF read support';
                            } else {
                                $this->log .= '- source image is GIF<br />';
                            }
                        }
                        break;
                    default:
                        $this->processed = false;
                        $this->error = 'Can\'t read image source. not an image?';
                }

                if ($this->processed && $image_src) {

                    $this->image_src_x = imagesx($image_src);
                    $this->image_src_y = imagesy($image_src);
                    $this->image_dst_x = $this->image_src_x;
                    $this->image_dst_y = $this->image_src_y;
                    
                    if ($this->image_resize) {
                        $this->log .= '- resizing...<br />';			
                        if ($this->image_ratio_x) {
                            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;calculate x size<br />';
                            $this->image_dst_x = round(($this->image_src_x * $this->image_y) / $this->image_src_y);
                            $this->image_dst_y = $this->image_y;
                        } else if ($this->image_ratio_y) {
                            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;calculate y size<br />';
                            $this->image_dst_x = $this->image_x;
//                            $this->image_dst_y = round(($this->image_src_y * $this->image_x) / $this->image_src_x);
							$this->image_dst_y = $this->image_y;
                        } else if ($this->image_ratio || $this->image_ratio_no_zoom_in || $this->image_ratio_no_zoom_out) {
                            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;check x/y sizes<br />';
                            if ((!$this->image_ratio_no_zoom_in && !$this->image_ratio_no_zoom_out)
                                 || ($this->image_ratio_no_zoom_in && $this->image_src_x < $this->image_x && $this->image_src_y < $this->image_y)
                                 || ($this->image_ratio_no_zoom_out && ($this->image_src_x > $this->image_x || $this->image_src_y > $this->image_y))) {
                                $this->image_dst_x = $this->image_x;
                                $this->image_dst_y = $this->image_y;
                                if (($this->image_src_x/$this->image_x) > ($this->image_src_y/$this->image_y)) {
                                    $this->image_dst_x = $this->image_x;
                                    $this->image_dst_y = intval($this->image_src_y*($this->image_x / $this->image_src_x));
                                } else {
                                    $this->image_dst_y = $this->image_y;
                                    $this->image_dst_x = intval($this->image_src_x*($this->image_y / $this->image_src_y));
                                }
                            } else {
                                $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;doesn\'t calculate x/y sizes<br />';
                                $this->image_dst_x = $this->image_src_x;
                                $this->image_dst_y = $this->image_src_y;
                            }
                        } else {
                            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;use plain sizes<br />';
                            $this->image_dst_x = $this->image_x;
                            $this->image_dst_y = $this->image_y;
                        }

                        $gd_version = $this->gd_version();

                        if ($gd_version >= 2 && !$this->preserve_transparency) {
                            $image_dst = imagecreatetruecolor($this->image_dst_x, $this->image_dst_y);
                        } else {
                            $image_dst = imagecreate($this->image_dst_x, $this->image_dst_y);
                        }
        
                        if ($this->preserve_transparency) {        
                            $transparent_color = imagecolortransparent($image_src);
                            imagepalettecopy($image_dst, $image_src);
                            imagefill($image_dst, 0, 0, $transparent_color);
                            imagecolortransparent($image_dst, $transparent_color);
                        }

                        if ($gd_version >= 2 && !$this->preserve_transparency) {
                            $res = imagecopyresampled($image_dst, $image_src, 0, 0, 0, 0, $this->image_dst_x, $this->image_dst_y, $this->image_src_x, $this->image_src_y);
                        } else {
                            $res = imagecopyresized($image_dst, $image_src, 0, 0, 0, 0, $this->image_dst_x, $this->image_dst_y, $this->image_src_x, $this->image_src_y);
                        }


                        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;resized image object created<br />';
                        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;image_src_x y        : ' . $this->image_src_x . ' x ' . $this->image_src_y . '<br />';
                        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;image_dst_x y        : ' . $this->image_dst_x . ' x ' . $this->image_dst_y . '<br />';

                        // we have to set image_convert if it is not already
                        if (empty($this->image_convert)) {
                            $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;setting destination file type to ' . $this->file_src_name_ext . '<br />';
                            $this->image_convert = $this->file_src_name_ext;
                        }
                    } else {
                        // we only convert, so we link the dst image to the src image
                        $image_dst = & $image_src;
                    }


                    $this->log .= '- converting...<br />';
                    switch($this->image_convert) {
                        case 'jpeg':
                        case 'jpg':
                            $result = @imagejpeg ($image_dst, $this->file_dst_pathname, $this->jpeg_quality);
														
														if (!$result) {
                                $this->processed = false;
                                $this->error = 'No JPEG create support';
                            } else {
                                $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;JPEG image created.<br />';
                            }
                            break;
                        case 'png':
                            $result = @imagepng ($image_dst, $this->file_dst_pathname);
                            if (!$result) {
                                $this->processed = false;
                                $this->error = 'No PNG create support';
                            } else {
                                $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;PNG image created.<br />';
                            }
                            break;
                        case 'gif':
                            $result = @imagegif ($image_dst, $this->file_dst_pathname);
                            if (!$result) {
                                $this->processed = false;
                                $this->error = 'No GIF create support';
                            } else {
                                $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;GIF image created.<br />';
                            }
                            break;
                        default:
                            $this->processed = false;
                            $this->error = 'No convertion type defined';
                    }
                    if ($this->processed) {
                        if (is_resource($image_src)) imagedestroy($image_src);
                        if (is_resource($image_dst)) imagedestroy($image_dst);
                        $this->log .= '&nbsp;&nbsp;&nbsp;&nbsp;image objects destroyed.<br />';
                    }
                }

            } else {
                $this->log .= '- no image processing wanted<br />';

                $result = is_uploaded_file($this->file_src_pathname);
                if ($result) {
                    $result = file_exists($this->file_src_pathname);
                    if ($result) {
                        $result = copy($this->file_src_pathname, $this->file_dst_pathname);
                        if (!$result) {
                            $this->processed = false;
                            $this->error = 'Error copying file on the server. Copy failed.';
                        }
                    } else {
                        $this->processed = false;
                        $this->error = 'Error copying file on the server. Missing source file.';
                    }
                } else {
                    $this->processed = false;
                    $this->error = 'Error copying file on the server. Incorrect source file.';
                }


                //$result = move_uploaded_file($this->file_src_pathname, $this->file_dst_pathname);
                //if (!$result) {
                //    $this->processed = false;
                //    $this->error = 'Error copying file on the server.';
                //}
            }

        }

        if ($this->processed) {
            $this->log .= '<b>upload OK</b><br />';

        }
        // we reinit all the var
        $this->init();

    }

    /**
     * Deletes the uploaded file from its temporary location
     *
     * When PHP uploads a file, it stores it in a temporary location.
     * When you {@link process} the file, you actually copy the resulting file to the given location, it doesn't alter the original file.
     * Once you have processed the file as many times as you wanted, you can delete the uploaded file.
     *
     * @access public
     */
    function clean() {
         unlink($this->file_src_pathname);
    }

}
?>